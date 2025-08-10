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
    fetch('http://localhost:8000/api/fixtures/')
      .then(res => res.json())
      .then(data => {
        const filtered = data
          .filter(match =>
            topTeams.includes(match.team_a?.name) ||
            topTeams.includes(match.team_b?.name)
          )
          .slice(0, 3);
        setFixtures(filtered);
        setLoadingFixtures(false);
      })
      .catch(err => {
        console.error('Error fetching fixtures:', err);
        setLoadingFixtures(false);
      });

    // Fetch top scorers
    fetch('http://localhost:8000/api/top_scorers/')
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
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid #1a4b5aff',
                      borderRadius: 1,
                      transition: '0.2s',
                      '&:hover': {
                        boxShadow: 2,
                        borderColor: '#274472',
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

        {/* Fixtures Section */}
        <Section title="Upcoming Fixtures for Top Teams">
          {loadingFixtures ? (
            <Typography>Loading fixtures...</Typography>
          ) : fixtures.length === 0 ? (
            <Typography>No upcoming fixtures.</Typography>
          ) : (
            <Grid container spacing={2}>
              {fixtures.map((match, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      height: '100%',
                      border: '1px solid #ddd',
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center">
                          <Avatar src={match.team_a?.logo} alt={match.team_a?.name} sx={{ mr: 1 }} />
                          <Typography variant="subtitle1">{match.team_a?.name}</Typography>
                        </Box>
                        <Typography fontWeight="bold">VS</Typography>
                        <Box display="flex" alignItems="center">
                          <Typography variant="subtitle1" sx={{ mr: 1 }}>{match.team_b?.name}</Typography>
                          <Avatar src={match.team_b?.logo} alt={match.team_b?.name} />
                        </Box>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                      >
                        {new Date(match.date).toLocaleString()} | {match.venue}
                      </Typography>
                    </CardContent>
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
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {topScorers.map((player, idx) => (
                <Box
                  key={idx}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    mb: idx < topScorers.length - 1 ? 1.5 : 0,
                    p: 1,
                    borderRadius: 2,
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar src={player.photo} alt={player.name} sx={{ mr: 1 }} />
                    <Typography>{player.name}</Typography>
                  </Box>
                  <Typography fontWeight="bold">{player.goals} ⚽</Typography>
                </Box>
              ))}
            </Paper>
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
