from rest_framework import viewsets, filters
from sports.models import Club, MatchResult, NewsArticle, ClubStats, MatchFixture, Player, PlayerStats
from .serializers import ClubSerializer,MatchResultSerializer, NewsArticleSerializer, MatchFixtureSerializer, PlayerSerializer, TopFixtureSerializer, ClubStatsSerializer, PlayerHighlightSerializer, PlayerStatsSerializer, TopScorerSerializer
from rest_framework.response import Response
from django.db.models import F, ExpressionWrapper, IntegerField
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer
from django.db.models import Count
from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailTokenObtainPairSerializer
from django.db.models import Q
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
                assists=Count('stats__assists')  
            )
            .order_by('-goals')[:3]
        )

        serializer = TopScorerSerializer(top_scorers, many=True)
        return Response(serializer.data)


class TopThreeFixturesViewSet(viewsets.ViewSet):
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




from sports.models import MatchFixture, MatchResult, ClubNewsArticle
from .serializers import MatchFixtureSerializer, MatchResultSerializer, ClubNewsArticleSerializer

class ClubFixturesViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MatchFixtureSerializer

    def get_queryset(self):
        club_id = self.kwargs['club_id']
        return MatchFixture.objects.filter(team_a__id=club_id) | MatchFixture.objects.filter(team_b__id=club_id)


class ClubResultsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MatchResultSerializer

    def get_queryset(self):
        club_id = self.kwargs['club_id']
        return MatchResult.objects.filter(team_a__id=club_id) | MatchResult.objects.filter(team_b__id=club_id)


class ClubNewsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ClubNewsArticleSerializer

    def get_queryset(self):
        club_id = self.kwargs['club_id']
        return ClubNewsArticle.objects.filter(club__id=club_id)

from rest_framework.viewsets import ViewSet
from django.shortcuts import get_object_or_404

class ClubContentViewSet(ViewSet):
    """
    Returns news, fixtures, and results related to a specific club.
    """
    def retrieve(self, request, pk=None):
        club = get_object_or_404(Club, pk=pk)

        # Fetch related content
        news = ClubNewsArticle.objects.filter(club=club).order_by('-date')
        fixtures = MatchFixture.objects.filter(team_a=club) | MatchFixture.objects.filter(team_b=club)
        results = MatchResult.objects.filter(team_a=club) | MatchResult.objects.filter(team_b=club)

        # Serialize
        news_data = ClubNewsArticleSerializer(news, many=True).data
        fixture_data = MatchFixtureSerializer(fixtures, many=True).data
        result_data = MatchResultSerializer(results, many=True).data

        return Response({
            'club_id': club.id,
            'club_name': club.name,
            'news': news_data,
            'fixtures': fixture_data,
            'results': result_data,
        }, status=status.HTTP_200_OK)


from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from chat.models import ChatMessage
from .serializers import UserWithMessagesSerializer, MessageSerializer

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['get', 'delete'], url_path='me')
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        elif request.method == 'DELETE':
            request.user.delete()
            return Response({"detail": "Account deleted"}, status=status.HTTP_204_NO_CONTENT)



class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatMessage.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



from sports.models import PlayerStats
from .serializers import PlayerStatsSerializer

class PlayerStatsView(viewsets.ViewSet):
    serializer_class = PlayerStatsSerializer

   
    def list(self, request):
        players = (
            Player.objects
            .annotate(
                goals=Count('goal'),
            )
            .order_by('-goals')
        )

        serializer = TopScorerSerializer(players, many=True)
        return Response(serializer.data)

  