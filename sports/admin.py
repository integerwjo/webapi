from django.contrib import admin
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.forms.models import BaseInlineFormSet
from .models import MatchFixture, MatchResult, Club, Player, PlayerStats, ClubStats, Goal


# --- PLAYER ADMIN (for goal assignment autocomplete) ---
class PlayerAdmin(admin.ModelAdmin):
    search_fields = ['name']

admin.site.register(Player, PlayerAdmin)


# --- INLINE FORMSET FOR GOAL VALIDATION ---
class GoalInlineFormSet(BaseInlineFormSet):
    def clean(self):
        super().clean()

        if any(self.errors):
            return  # Skip if any form already has errors

        match = self.instance  # MatchResult instance
        team_a_goal_count = 0
        team_b_goal_count = 0

        for form in self.forms:
            if not form.cleaned_data or form.cleaned_data.get('DELETE', False):
                continue

            player = form.cleaned_data.get('player')
            if player:
                if player.club == match.team_a:
                    team_a_goal_count += 1
                elif player.club == match.team_b:
                    team_b_goal_count += 1
                else:
                    raise ValidationError(f"Player {player.name} does not belong to either team in this match.")

        total_input_goals = (match.score_a or 0) + (match.score_b or 0)
        total_actual_goals = team_a_goal_count + team_b_goal_count

        if total_input_goals != total_actual_goals:
            raise ValidationError(
                _(f"Total goals recorded in fields (score_a + score_b = {total_input_goals}) "
                  f"must match number of Goal entries ({total_actual_goals}).")
            )

        if match.score_a != team_a_goal_count or match.score_b != team_b_goal_count:
            raise ValidationError(
                _(f"Goals entered: Team A ({team_a_goal_count}), Team B ({team_b_goal_count}) "
                  f"must match scores: Team A ({match.score_a}), Team B ({match.score_b}).")
            )


# --- GOAL INLINE ---
class GoalInline(admin.TabularInline):
    model = Goal
    extra = 1
    autocomplete_fields = ['player']
    formset = GoalInlineFormSet


# --- MATCH RESULT ADMIN ---
class MatchResultAdmin(admin.ModelAdmin):
    inlines = [GoalInline]

    def save_model(self, request, obj, form, change):
        # Save MatchResult normally
        super().save_model(request, obj, form, change)

    def save_related(self, request, form, formsets, change):
        # Save related Goal objects
        super().save_related(request, form, formsets, change)

        # Update scores and stats
        obj = form.instance
        obj.update_from_goals()


# --- REGISTER MODELS ---
admin.site.register(MatchResult, MatchResultAdmin)
admin.site.register(MatchFixture)
admin.site.register(Club)
admin.site.register(PlayerStats)
admin.site.register(ClubStats)
