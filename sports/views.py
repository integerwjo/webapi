from django.shortcuts import render

# Create your views here.
from .models import Club
from django.shortcuts import redirect
from sports.services.match_results import submit_match_result_with_goals

def submit_match_view(request):
    if request.method == 'POST':
        team_a = Club.objects.get(id=request.POST['team_a_id'])
        team_b = Club.objects.get(id=request.POST['team_b_id'])
        date = request.POST['date']
        venue = request.POST['venue']

        goals_data = [
            {'player_id': int(pid), 'minute': int(minute)}
            for pid, minute in zip(request.POST.getlist('player_ids'), request.POST.getlist('minutes'))
        ]

        submit_match_result_with_goals(team_a, team_b, date, venue, goals_data)
        return redirect('/results/')  # Redirect to results page after submission
