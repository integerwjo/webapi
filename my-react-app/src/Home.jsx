import React, { useEffect, useState } from 'react';
import stadiumImg from './assets/stadium.jpg';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Avatar,
  CardActionArea,
  Paper
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import HeroTyping from './HeroTyping';
import TopTeamFixtures from './TopTeamsFixtures.jsx';

function Home() {
  const [articles, setArticles] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingFixtures, setLoadingFixtures] = useState(true);
  const [loadingScorers, setLoadingScorers] = useState(true);

  const topTeams = ['Team A', 'Team B']; // ← replace with actual top two team names

  useEffect(() => {
    // Fetch news
    fetch('http://localhost:8000/api/news/')
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setLoadingNews(false);
      })
      .catch(err => {
        console.error('Error fetching articles:', err);
        setLoadingNews(false);
      });

    // Fetch fixtures
    fetch('http://localhost:8000/api/top-teams-fixtures/')
      .then(res => res.json())
      .then(data => {
        setFixtures(data);
        setLoadingFixtures(false);
      })
      .catch(err => {
        console.error('Error fetching fixtures:', err);
        setLoadingFixtures(false);
      });

    // Fetch top scorers
    fetch('http://localhost:8000/api/top-scorers/')
      .then(res => res.json())
      .then(data => {
        setTopScorers(data.slice(0, 3)); // take top 3
        setLoadingScorers(false);
      })
      .catch(err => {
        console.error('Error fetching top scorers:', err);
        setLoadingScorers(false);
      });
  }, []);

  const handleCardClick = (id) => {
    console.log('Navigate to article with ID:', id);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: `url(${stadiumImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: { xs: 8, md: 12 },
          color: '#fff',
          textAlign: 'center',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(30,60,114,0.7), rgba(42,82,152,0.85))',
            zIndex: 1,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '200%',
            height: '100%',
            backgroundImage: `url('/images/smoke.png')`,
            backgroundRepeat: 'repeat',
            backgroundSize: 'cover',
            opacity: 0.15,
            animation: 'smokeMove 60s linear infinite',
            zIndex: 2,
          },
          '@keyframes smokeMove': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(50%)' },
          },
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 3 }}>
          <SportsSoccerIcon sx={{ fontSize: 50 }} />
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Endebess Football League
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.85)">
            <HeroTyping />
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container sx={{ py: 6 }}>
        {/* News Section */}
        <Section title="Latest News">
          {loadingNews ? (
            <Typography>Loading articles...</Typography>
          ) : articles.length === 0 ? (
            <Typography>No articles available.</Typography>
          ) : (
            <Grid container spacing={4}>
              {articles.map(article => (
                <Grid item xs={12} sm={6} md={4} key={article.id}>
                  <Card
                  elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid #ddd',
                      borderRadius: 1,
                      transition: '0.2s',
                      '&:hover': {
                        borderColor: '#ddddd',
                      },
                    }}
                    onClick={() => handleCardClick(article.id)}
                  >
                    <CardActionArea sx={{ height: '100%' }}>
                      {article.image && (
                        <CardMedia
                          component="img"
                          image={article.image}
                          alt={article.title}
                          height="180"
                        />
                      )}
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(article.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="h6" fontWeight={600} mt={1}>
                          {article.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={1}>
                          {article.summary}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Section>

        {/* Top Scorers Section */}
<Section title="Top Scorers">
  {loadingScorers ? (
    <Typography>Loading top scorers...</Typography>
  ) : topScorers.length === 0 ? (
    <Typography>No top scorers data.</Typography>
  ) : (
    <Grid container spacing={3}>
      {topScorers.map((player) => (
        <Grid item xs={12} sm={6} md={4} key={player.player_id}>
          <Card
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              borderRadius: 1,
              cursor: 'pointer',
              border: '1px solid #ddd',
              transition: 'transform 0.2s ease',
              '&:hover': {
                border: '1px solid #1f2937'
              },
            }}
          >
            <Avatar
              src={`http://localhost:8000${player.photo}`}
              alt={player.player_name}
              sx={{ width: 64, height: 64, mr: 2, borderRadius: 2 }}
              variant="rounded"
            />
            <CardContent sx={{ flex: '1 1 auto', p: 0 }}>
              <Typography variant="h6" fontWeight={700} noWrap>
                {player.player_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {player.club_name}
              </Typography>
              <Box mt={1} display="flex" gap={2}>
                <Typography variant="body2" color="text.primary">
                  <strong>{player.goals}</strong> ⚽ Goals
                </Typography>
                <Typography variant="body2" color="text.primary">
                  <strong>{player.appearances}</strong> Apps
                </Typography>
                <Typography variant="body2" color="text.primary">
                  <strong>{player.assists}</strong> Assists
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )}
</Section>
    {/* Top Teams Fixtures Section */}
        <Section title="Upcoming Fixtures">
      {loadingFixtures ? (
        <Typography>Loading fixtures...</Typography>
      ) : fixtures.length === 0 ? (
        <Typography>No upcoming fixtures.</Typography>
      ) : (
        <TopTeamFixtures fixtures={fixtures} />
      )}
    </Section>
      </Container>
    </Box>
  );
}

// 📦 Reusable section wrapper
function Section({ title, children }) {
  return (
    <Box mb={6}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        {title}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {children}
    </Box>
  );
}

export default Home;
