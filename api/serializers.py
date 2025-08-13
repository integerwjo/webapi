from rest_framework import serializers
from sports.models import Club, MatchResult, NewsArticle, ClubStats, MatchFixture, PlayerStats, Player, Goal
from django.db.models import F, Count
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # Important for validation

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        # authenticate using email
        user = authenticate(request=self.context.get('request'),
                            email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password")

        data = super().validate({
            self.username_field: email,
            "password": password
        })
        return data

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user




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
        user = User.objects.create_user(**validated_data)
        return user


class PlayerHighlightSerializer(serializers.ModelSerializer):
    stat = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()  # return URL

    class Meta:
        model = Player
        fields = ['id', 'name', 'stat', 'photo_url']

    def get_stat(self, obj):
        return self.context.get('stat_value', None)

    def get_photo_url(self, obj):
        if obj.photo:
            return obj.photo.url
        return None



class LeagueStandingSerializer(serializers.ModelSerializer):
    goal_diff = serializers.IntegerField()
    points = serializers.IntegerField()

    class Meta:
        model = Club
        fields = ['id', 'name', 'logo', 'goal_diff', 'points']

    def to_representation(self, instance):
        # Calculate goal difference and points
        instance.goal_diff = instance.stats.goals_for - instance.stats.goals_against
        instance.points = instance.stats.points
        return super().to_representation(instance)
    



class PlayerStatsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PlayerStats
        fields = [
            'appearances',
            'goals',
            'assists',
            'yellow_cards',
            'red_cards',
        ]


class PlayerSerializer(serializers.ModelSerializer):
    stats = PlayerStatsSerializer(read_only=True)
    club_name = serializers.CharField(source='club.name', read_only=True)
    photo_url = serializers.SerializerMethodField()  # new field

    class Meta:
        model = Player
        fields = [
            'id', 'name', 'position', 'number', 'age', 'height', 'nationality',
            'photo', 'photo_url', 'foot', 'club', 'club_name', 'stats'
        ]

    def get_photo_url(self, obj):
        if obj.photo:
            return obj.photo.url
        return None


class ClubSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True)
    top_scorer = serializers.SerializerMethodField()
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = ['id', 'name', 'coach', 'logo', 'logo_url', 'players', 'top_scorer']

    def get_logo_url(self, obj):
        return obj.logo.url if obj.logo else None  # Works with CloudinaryField

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
                'photo_url': player.photo.url if player.photo else None,
                'stat': top_goal['goal_count'],
            }
        except Player.DoesNotExist:
            return None


class ClubStatsSerializer(serializers.ModelSerializer):
    club_logo_url = serializers.SerializerMethodField()
    club_name = serializers.CharField(source='club.name', read_only=True)
    
    class Meta:
        model = ClubStats
        fields = ['club_name', 'club_logo_url', 'played', 'wins', 'draws', 'losses', 'goals_for', 'goals_against', 'points']

    def get_club_logo_url(self, obj):
        return obj.club.logo.url if obj.club and obj.club.logo else None
    

class MatchResultSerializer(serializers.ModelSerializer):
    team_a = ClubSerializer(read_only=True)
    team_b = ClubSerializer(read_only=True)
    team_a_id = serializers.PrimaryKeyRelatedField(queryset=Club.objects.all(), source='team_a', write_only=True)
    team_b_id = serializers.PrimaryKeyRelatedField(queryset=Club.objects.all(), source='team_b', write_only=True)

    class Meta:
        model = MatchResult
        fields = [
            'id',
            'team_a', 'team_b',
            'team_a_id', 'team_b_id',
            'score_a', 'score_b',
            'date', 'venue'
        ]

class NewsArticleSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()  # return URL

    class Meta:
        model = NewsArticle
        fields = ['id', 'title', 'summary', 'image', 'image_url', 'date']

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None


class ClubStatsSerializer(serializers.ModelSerializer):
    club = ClubSerializer(read_only=True)
    club_id = serializers.PrimaryKeyRelatedField(
        queryset=Club.objects.all(),
        source='club',
        write_only=True
    )
    goal_difference = serializers.SerializerMethodField()

    class Meta:
        model = ClubStats
        fields = [
            'id',
            'club',
            'club_id',
            'played',
            'wins',
            'draws',
            'losses',
            'goals_for',
            'goals_against',
            'points',
            'goal_difference',
        ]

    def get_goal_difference(self, obj):
        return obj.goal_difference()



class MatchFixtureSerializer(serializers.ModelSerializer):
    team_a = ClubSerializer(read_only=True)
    team_b = ClubSerializer(read_only=True)
    team_a_id = serializers.PrimaryKeyRelatedField(
        queryset=Club.objects.all(), source='team_a', write_only=True
    )
    team_b_id = serializers.PrimaryKeyRelatedField(
        queryset=Club.objects.all(), source='team_b', write_only=True
    )

    class Meta:
        model = MatchFixture
        fields = [
            'id',
            'team_a', 'team_b',
            'team_a_id', 'team_b_id',
            'date',
            'venue',
        ]





class TopScorerSerializer(serializers.Serializer):
    player_id = serializers.IntegerField(source='player.id')
    player_name = serializers.CharField(source='player.name')
    club_name = serializers.CharField(source='player.club.name')
    goals = serializers.IntegerField()
    appearances = serializers.IntegerField()
    assists = serializers.IntegerField()
    photo_url = serializers.SerializerMethodField()

    def get_photo_url(self, obj):
        return obj.player.photo.url if obj.player and obj.player.photo else None



class TopFixtureSerializer(serializers.ModelSerializer):
    team_a_name = serializers.CharField(source="team_a.name", read_only=True)
    team_b_name = serializers.CharField(source="team_b.name", read_only=True)

    class Meta:
        model = MatchFixture
        fields = ["id", "team_a", "team_a_name", "team_b", "team_b_name", "date", "venue"]
