from django.db import transaction
from sports.models import MatchResult, Goal

@transaction.atomic
def submit_match_result_with_goals(team_a, team_b, date, venue, goals_data):
    """
    Creates a MatchResult and related Goals.
    
    goals_data = [
        {"player_id": 1, "minute": 23},
        {"player_id": 2, "minute": 45},
        ...
    ]
    """
    match = MatchResult.objects.create(
        team_a=team_a,
        team_b=team_b,
        date=date,
        venue=venue
    )

    for goal in goals_data:
        Goal.objects.create(
            match=match,
            player_id=goal["player_id"],
            minute=goal.get("minute", None)
        )

    match.update_from_goals()
    return match
