from django.db import models
from django.db.models import F
from django.core.exceptions import ValidationError
from cloudinary.models import CloudinaryField


class Club(models.Model):
    name = models.CharField(max_length=100)
    logo = CloudinaryField('image', null=True, blank=True)
    coach = models.CharField(max_length=100)

    def __str__(self):
        return self.name



class ClubStats(models.Model):
    club = models.OneToOneField(Club, on_delete=models.CASCADE, related_name='stats')
    played = models.PositiveIntegerField(default=0)
    wins = models.PositiveIntegerField(default=0)
    draws = models.PositiveIntegerField(default=0)
    losses = models.PositiveIntegerField(default=0)
    goals_for = models.PositiveIntegerField(default=0)
    goals_against = models.PositiveIntegerField(default=0)
    points = models.PositiveIntegerField(default=0)

    def goal_difference(self):
        return self.goals_for - self.goals_against

    def __str__(self):
        return f"{self.club.name} Stats"


class NewsArticle(models.Model):
    title = models.CharField(max_length=200)
    summary = models.TextField()
    image = models.ImageField(upload_to='articles/', blank=True, null=True)
    date = models.DateField()

    def __str__(self):
        return self.title


class MatchFixture(models.Model):
    team_a = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='home_fixtures')
    team_b = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='away_fixtures')
    date = models.DateTimeField()
    venue = models.CharField(max_length=255)

    def clean(self):
        if self.team_a == self.team_b:
            raise ValidationError("Team A and Team B must be different.")

    def __str__(self):
        return f"{self.team_a.name} vs {self.team_b.name} @ {self.venue} on {self.date.strftime('%Y-%m-%d %H:%M')}"


class MatchResult(models.Model):
    team_a = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='results_as_team_a')
    team_b = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='results_as_team_b')
    score_a = models.PositiveIntegerField(default=0)
    score_b = models.PositiveIntegerField(default=0)
    date = models.DateTimeField()
    venue = models.CharField(max_length=255)

    def clean(self):
        if self.team_a == self.team_b:
            raise ValidationError("Team A and Team B must be different.")

    def __str__(self):
        return f"{self.team_a.name} {self.score_a} - {self.score_b} {self.team_b.name} @ {self.venue}"

    def update_from_goals(self):
        # Update match scores
        self.score_a = self.goals.filter(player__club=self.team_a).count()
        self.score_b = self.goals.filter(player__club=self.team_b).count()
        self.save(update_fields=["score_a", "score_b"])

        # Update club stats
        team_a_stats, _ = ClubStats.objects.get_or_create(club=self.team_a)
        team_b_stats, _ = ClubStats.objects.get_or_create(club=self.team_b)

        team_a_stats.played += 1
        team_b_stats.played += 1

        team_a_stats.goals_for += self.score_a
        team_a_stats.goals_against += self.score_b
        team_b_stats.goals_for += self.score_b
        team_b_stats.goals_against += self.score_a

        if self.score_a > self.score_b:
            team_a_stats.wins += 1
            team_b_stats.losses += 1
            team_a_stats.points += 3
        elif self.score_b > self.score_a:
            team_b_stats.wins += 1
            team_a_stats.losses += 1
            team_b_stats.points += 3
        else:
            team_a_stats.draws += 1
            team_b_stats.draws += 1
            team_a_stats.points += 1
            team_b_stats.points += 1

        team_a_stats.save()
        team_b_stats.save()

        for goal in self.goals.all():
            pstats, _ = PlayerStats.objects.get_or_create(player=goal.player)
            pstats.goals = F('goals') + 1
            pstats.save()


class Player(models.Model):
    FOOT_CHOICES = [
        ('left', 'Left'),
        ('right', 'Right'),
        ('both', 'Both'),
    ]

    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='players')
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=50)
    number = models.PositiveIntegerField(null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(help_text="Height in cm", null=True, blank=True)
    nationality = models.CharField(max_length=50, null=True, blank=True)
    photo = models.ImageField(upload_to='players/photos/', null=True, blank=True)
    foot = models.CharField(max_length=5, choices=FOOT_CHOICES, null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.club.name})"


class PlayerStats(models.Model):
    player = models.OneToOneField(Player, on_delete=models.CASCADE, related_name='stats')
    appearances = models.PositiveIntegerField(default=0)
    goals = models.PositiveIntegerField(default=0)
    assists = models.PositiveIntegerField(default=0)
    yellow_cards = models.PositiveIntegerField(default=0)
    red_cards = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.player.name} Stats"


class Goal(models.Model):
    match = models.ForeignKey(MatchResult, on_delete=models.CASCADE, related_name='goals')
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    minute = models.PositiveIntegerField(null=True, blank=True)

    def clean(self):
        super().clean()
        if not self.player:
            raise ValidationError("Goal must be assigned to a player.")
        if self.player.club not in [self.match.team_a, self.match.team_b]:
            raise ValidationError("Player does not belong to a club in this match.")

    def __str__(self):
        return f"{self.player.name} scored in {self.match}"
