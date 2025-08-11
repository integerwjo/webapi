from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    ClubStatsViewSet, ClubViewSet, MatchResultViewSet, NewsArticleViewSet,
    MatchFixtureViewSet, PlayerHighlightsViewSet, PlayerViewSet,
    RegisterView, EmailTokenObtainPairView, TopScorersViewSet, TopTeamsFixturesViewSet, TopThreeFixturesViewSet
)

router = DefaultRouter()
router.register(r'top-scorers', TopScorersViewSet, basename='top-scorers')
router.register(r'clubs', ClubViewSet, basename='club')
router.register(r'results', MatchResultViewSet, basename='results')
router.register(r'news', NewsArticleViewSet, basename='news')
router.register(r'fixtures', MatchFixtureViewSet, basename='fixtures')
router.register(r'players', PlayerViewSet, basename='players')
router.register(r'standings', ClubStatsViewSet, basename='standings')
router.register(r'player-highlights', PlayerHighlightsViewSet, basename='player-highlights')
router.register(r'top-teams-fixtures', TopThreeFixturesViewSet, basename='top-teams-fixtures')


urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
]

