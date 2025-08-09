from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import F
from .models import MatchResult, ClubStats, PlayerStats

@receiver(post_save, sender=MatchResult)
def sync_match_stats(sender, instance, created, **kwargs):
    if not created:
        return

    # First, sync up scores from goals
    instance.update_from_goals()

    # Then update club stats using F() expressions to avoid race conditions
    team_a_stats, _ = ClubStats.objects.get_or_create(club=instance.team_a)
    team_b_stats, _ = ClubStats.objects.get_or_create(club=instance.team_b)

    team_a_stats.played = F('played') + 1
    team_b_stats.played = F('played') + 1
    team_a_stats.goals_for = F('goals_for') + instance.score_a
    team_a_stats.goals_against = F('goals_against') + instance.score_b
    team_b_stats.goals_for = F('goals_for') + instance.score_b
    team_b_stats.goals_against = F('goals_against') + instance.score_a

    if instance.score_a > instance.score_b:
        team_a_stats.wins = F('wins') + 1
        team_b_stats.losses = F('losses') + 1
        team_a_stats.points = F('points') + 3
    elif instance.score_b > instance.score_a:
        team_b_stats.wins = F('wins') + 1
        team_a_stats.losses = F('losses') + 1
        team_b_stats.points = F('points') + 3
    else:
        team_a_stats.draws = F('draws') + 1
        team_b_stats.draws = F('draws') + 1
        team_a_stats.points = F('points') + 1
        team_b_stats.points = F('points') + 1

    team_a_stats.save()
    team_b_stats.save()

    # Now update each player's goals
    for goal in instance.goals.select_related('player'):  # optimize
        pstats, _ = PlayerStats.objects.get_or_create(player=goal.player)
        pstats.goals = F('goals') + 1
        pstats.save()
