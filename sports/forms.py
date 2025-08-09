# sports/forms.py
from django import forms
from django.core.exceptions import ValidationError
from .models import MatchResult, Goal

class MatchResultAdminForm(forms.ModelForm):
    class Meta:
        model = MatchResult
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        match = cleaned_data.get('match')
        team_a_goals = cleaned_data.get('team_a_goals')
        team_b_goals = cleaned_data.get('team_b_goals')

        if match and team_a_goals is not None and team_b_goals is not None:
            total_goals = team_a_goals + team_b_goals
            actual_goals = Goal.objects.filter(match_result=self.instance).count()

            if total_goals != actual_goals:
                raise ValidationError(
                    f"Total goals entered (Team A + B = {total_goals}) do not match the number of registered Goal records ({actual_goals})."
                )
