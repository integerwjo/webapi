from rest_framework import serializers
from sports.models import (
    Club, MatchResult, NewsArticle, ClubStats, MatchFixture,
    PlayerStats, Player, Goal
)
from chat.models import ChatMessage
from django.db.models import Count
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate


# ========================
# Auth & User Serializers
# ========================
class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(request=self.context.get('request'),
                            email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password")

        return super().validate({
            self.username_field: email,
            "password": password
        })


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords don't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)


# ========================
# Player Serializers
# ========================
class PlayerStatsSerializer(serializers.ModelSerializer):
    club_name = serializers.CharField(source='player.club.name')
    goals = serializers.IntegerField(read_only=True)
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = PlayerStats
        fields = ['id', 'player', 'club_name', 'goals', 'photo_url']

    def get_photo_url(self, obj):
        return getattr(obj.player.photo, 'url', None)





class PlayerSerializer(serializers.ModelSerializer):
    stats = PlayerStatsSerializer(read_only=True)
    club_name = serializers.CharField(source='club.name', read_only=True)
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = [
            'id', 'name', 'position', 'number', 'age', 'height',
            'photo', 'photo_url', 'foot', 'club', 'club_name', 'stats'
        ]

    def get_photo_url(self, obj):
        return getattr(obj.photo, 'url', None)


class PlayerHighlightSerializer(serializers.ModelSerializer):
    stat = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = ['id', 'name', 'stat', 'photo_url']

    def get_stat(self, obj):
        # stat_value is passed from the view via context
        return self.context.get('stat_value', 0)

    def get_photo_url(self, obj):
        return getattr(obj.photo, 'url', None)



# ========================
# Club Serializers
# ========================
class ClubSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)
    top_scorer = serializers.SerializerMethodField()
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = ['id', 'name', 'coach', 'logo', 'logo_url', 'players', 'top_scorer']

    def get_logo_url(self, obj):
        return getattr(obj.logo, 'url', None)

    def get_top_scorer(self, club):
        top_goal = (
            Goal.objects.filter(player__club=club)
            .values('player')
            .annotate(goal_count=Count('id'))
            .order_by('-goal_count')
            .first()
        )
        if not top_goal:
            return None

        try:
            player = Player.objects.get(id=top_goal['player'])
            return {
                'id': player.id,
                'name': player.name,
                'photo_url': getattr(player.photo, 'url', None),
                'stat': top_goal['goal_count'],
            }
        except Player.DoesNotExist:
            return None


class ClubStatsSerializer(serializers.ModelSerializer):
    club = ClubSerializer(read_only=True)
    club_id = serializers.PrimaryKeyRelatedField(queryset=Club.objects.all(), source='club', write_only=True)
    goal_difference = serializers.SerializerMethodField()

    class Meta:
        model = ClubStats
        fields = [
            'id', 'club', 'club_id', 'played', 'wins', 'draws',
            'losses', 'goals_for', 'goals_against', 'points', 'goal_difference'
        ]

    def get_goal_difference(self, obj):
        return obj.goal_difference()


class LeagueStandingSerializer(serializers.ModelSerializer):
    goal_diff = serializers.IntegerField()
    points = serializers.IntegerField()

    class Meta:
        model = Club
        fields = ['id', 'name', 'logo', 'goal_diff', 'points']

    def to_representation(self, instance):
        instance.goal_diff = instance.stats.goals_for - instance.stats.goals_against
        instance.points = instance.stats.points
        return super().to_representation(instance)


# ========================
# Match Serializers
# ========================
class GoalSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player.name', read_only=True)
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Goal
        fields = ['player_name', 'photo_url', 'minute']

    def get_photo_url(self, obj):
        return getattr(obj.player.photo, 'url', None)




class MatchResultSerializer(serializers.ModelSerializer):
    team_a = ClubSerializer(read_only=True)
    team_b = ClubSerializer(read_only=True)
    team_a_id = serializers.PrimaryKeyRelatedField(queryset=Club.objects.all(), source='team_a', write_only=True)
    team_b_id = serializers.PrimaryKeyRelatedField(queryset=Club.objects.all(), source='team_b', write_only=True)
    goals = GoalSerializer(many=True, read_only=True)

    class Meta:
        model = MatchResult
        fields = [
            'id',
            'team_a',
            'team_b',
            'team_a_id',
            'team_b_id',
            'score_a',
            'score_b',
            'date',
            'venue',
            'goals',
        ]


class MatchFixtureSerializer(serializers.ModelSerializer):
    team_a = ClubSerializer(read_only=True)
    team_b = ClubSerializer(read_only=True)
    team_a_id = serializers.PrimaryKeyRelatedField(queryset=Club.objects.all(), source='team_a', write_only=True)
    team_b_id = serializers.PrimaryKeyRelatedField(queryset=Club.objects.all(), source='team_b', write_only=True)

    class Meta:
        model = MatchFixture
        fields = ['id', 'team_a','team_b', 'team_a_id', 'team_b_id', 'date', 'venue']

class TopFixtureSerializer(serializers.ModelSerializer):
    team_a_name = serializers.CharField(source="team_a.name", read_only=True)
    team_b_name = serializers.CharField(source="team_b.name", read_only=True)
    team_a_logo = serializers.SerializerMethodField()
    team_b_logo = serializers.SerializerMethodField()

    def get_team_a_logo(self, obj):
        return getattr(obj.team_a, "logo_url", None)

    def get_team_b_logo(self, obj):
        return getattr(obj.team_b, "logo_url", None)

    class Meta:
        model = MatchFixture
        fields = [
            "id",
            "team_a",
            "team_a_name",
            "team_a_logo",
            "team_b",
            "team_b_name",
            "team_b_logo",
            "date",
            "venue",
        ]



# ========================
# News Serializers
# ========================
class NewsArticleSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = NewsArticle
        fields = ['id', 'title', 'summary', 'image', 'image_url', 'date']

    def get_image_url(self, obj):
        return getattr(obj.image, 'url', None)


# ========================
# Extra Stats Serializers
# ========================
class TopScorerSerializer(serializers.ModelSerializer):
    club_name = serializers.CharField(source='club.name')
    goals = serializers.IntegerField()
    assists = serializers.IntegerField()
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = ['id', 'name', 'club_name', 'goals', 'assists', 'photo_url']

    def get_photo_url(self, obj):
        return getattr(obj.photo, 'url', None)




from sports.models import ClubNewsArticle

class ClubNewsArticleSerializer(serializers.ModelSerializer):

    class Meta:
        model = ClubNewsArticle
        fields = [
            'id',
            'title',
            'summary',
            'date',
            'image',
        ]


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["id", "content", "created_at"]

class UserWithMessagesSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "messages"]