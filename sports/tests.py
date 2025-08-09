from django.test import TestCase
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils import timezone



# Create your tests here.
from .models import (
    Club, ClubStats, NewsArticle, MatchFixture,
    MatchResult, Player, PlayerStats
)


class ClubModelTest(TestCase):
    def test_create_and_str(self):
        club = Club.objects.create(name="Test FC", coach="John Doe")
        self.assertEqual(str(club), "Test FC")


class ClubStatsModelTest(TestCase):
    def setUp(self):
        self.club = Club.objects.create(name="Stats Club", coach="Jane Doe")

    def test_create_and_str(self):
        stats = ClubStats.objects.create(club=self.club, goals_for=10, goals_against=5)
        self.assertEqual(str(stats), "Stats Club Stats")

    def test_goal_difference(self):
        stats = ClubStats.objects.create(club=self.club, goals_for=15, goals_against=7)
        self.assertEqual(stats.goal_difference(), 8)


class NewsArticleModelTest(TestCase):
    def test_create_and_str(self):
        article = NewsArticle.objects.create(
            title="Big Match",
            summary="Summary here",
            date="2025-08-05"
        )
        self.assertEqual(str(article), "Big Match")


class MatchFixtureModelTest(TestCase):
    def setUp(self):
        self.club1 = Club.objects.create(name="Club A", coach="Coach A")
        self.club2 = Club.objects.create(name="Club B", coach="Coach B")

    def test_create_and_str(self):
        fixture = MatchFixture.objects.create(
            team_a=self.club1,
            team_b=self.club2,
            date=timezone.now(),
            venue="Main Stadium"
        )
        self.assertIn("Club A vs Club B", str(fixture))
        self.assertIn("Main Stadium", str(fixture))

    def test_validation_same_teams(self):
        fixture = MatchFixture(
            team_a=self.club1,
            team_b=self.club1,
            date=timezone.now(),
            venue="Main Stadium"
        )
        with self.assertRaises(ValidationError) as cm:
            fixture.clean()
        self.assertEqual(str(cm.exception), "{'__all__': ['Team A and Team B must be different.']}")


class MatchResultModelTest(TestCase):
    def setUp(self):
        self.club1 = Club.objects.create(name="Club A", coach="Coach A")
        self.club2 = Club.objects.create(name="Club B", coach="Coach B")

    def test_create_and_str(self):
        result = MatchResult.objects.create(
            team_a=self.club1,
            team_b=self.club2,
            score_a=2,
            score_b=1,
            date=timezone.now(),
            venue="Main Stadium"
        )
        self.assertIn("Club A 2 - 1 Club B", str(result))

    def test_validation_same_teams(self):
        result = MatchResult(
            team_a=self.club1,
            team_b=self.club1,
            score_a=0,
            score_b=0,
            date=timezone.now(),
            venue="Main Stadium"
        )
        with self.assertRaises(ValidationError) as cm:
            result.clean()
        self.assertEqual(str(cm.exception), "{'__all__': ['Team A and Team B must be different.']}")


class PlayerModelTest(TestCase):
    def setUp(self):
        self.club = Club.objects.create(name="Club X", coach="Coach X")

    def test_create_and_str(self):
        player = Player.objects.create(
            club=self.club,
            name="Player One",
            position="Forward",
            number=9,
            age=25,
            height=180,
            nationality="Country",
            foot="right"
        )
        self.assertEqual(str(player), "Player One (Club X)")


class PlayerStatsModelTest(TestCase):
    def setUp(self):
        self.club = Club.objects.create(name="Club X", coach="Coach X")
        self.player = Player.objects.create(club=self.club, name="Player One", position="Midfielder")

    def test_create_and_str(self):
        stats = PlayerStats.objects.create(player=self.player, goals=5, assists=7)
        self.assertEqual(str(stats), "Player One Stats")
