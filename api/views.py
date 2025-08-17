from rest_framework import viewsets, filters
from sports.models import Club, MatchResult, NewsArticle, ClubStats, MatchFixture, Player, PlayerStats
from .serializers import ClubSerializer,MatchResultSerializer, NewsArticleSerializer, MatchFixtureSerializer, PlayerSerializer, TopFixtureSerializer, ClubStatsSerializer, PlayerHighlightSerializer, PlayerStatsSerializer, TopScorerSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import F, ExpressionWrapper, IntegerField
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from .serializers import UserSerializer
from django.db.models import Count
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailTokenObtainPairSerializer
from django.db.models import Q
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.response import Response
from rest_framework import status



from rest_framework.decorators import action

class ClubViewSet(viewsets.ModelViewSet):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer


class MatchResultViewSet(viewsets.ModelViewSet):
    queryset = MatchResult.objects.all()
    serializer_class = MatchResultSerializer

class NewsArticleViewSet(viewsets.ModelViewSet):
    queryset = NewsArticle.objects.all()
    serializer_class = NewsArticleSerializer


class MatchFixtureViewSet(viewsets.ModelViewSet):
    queryset = MatchFixture.objects.all()
    serializer_class = MatchFixtureSerializer

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.select_related('club').prefetch_related('stats')
    serializer_class = PlayerSerializer

class ClubStatsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ClubStats.objects.select_related('club').order_by('-points')
    serializer_class = ClubStatsSerializer


class PlayerHighlightsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerHighlightSerializer

    @action(detail=False, methods=['get'])
    def highlights(self, request):
        top_scorer = Player.objects.annotate(
            goals=Count('goal')
        ).order_by('-goals').first()

        top_assister = Player.objects.annotate(
            assists=F('stats__assists')
        ).order_by('-assists').first()

        top_ga = Player.objects.annotate(
            goals=Count('goal'),
            assists=F('stats__assists'),
            goal_assist=ExpressionWrapper(
                Count('goal') + F('stats__assists'),
                output_field=IntegerField()
            )
        ).order_by('-goal_assist').first()

        data = {}

        for label, player, stat_field in [
            ('top_scorer', top_scorer, 'goals'),
            ('top_assister', top_assister, 'assists'),
            ('top_ga', top_ga, 'goal_assist'),
        ]:
            if player:
                stat_value = getattr(player, stat_field, 0)
                serializer = PlayerHighlightSerializer(
                    player,
                    context={'stat_value': stat_value}
                )
                data[label] = serializer.data

        return Response(data)




class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer




class TopScorersViewSet(viewsets.ViewSet):
    def list(self, request):
        top_scorers = (
            Player.objects
            .annotate(
                goals=Count('goal'),
                assists=Count('stats__assists')  # remove/adjust if no stats model
            )
            .order_by('-goals')[:3]
        )

        serializer = TopScorerSerializer(top_scorers, many=True)
        return Response(serializer.data)


class TopThreeFixturesViewSet(viewsets.ViewSet):
    """
    A ViewSet for listing fixtures involving the top 3 clubs.
    """
    def list(self, request):
        # Get top 3 clubs by points, with goals_for as tie-breaker
        top_clubs = (
            ClubStats.objects
            .select_related("club")
            .order_by("-points", "-goals_for")
            .values_list("club_id", flat=True)[:3]
        )

        # Get fixtures where either team is in the top 3
        fixtures = MatchFixture.objects.filter(
            team_a_id__in=top_clubs
        ) | MatchFixture.objects.filter(
            team_b_id__in=top_clubs
        )

        # Order by date
        fixtures = fixtures.order_by("date")

        serializer = TopFixtureSerializer(fixtures, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



