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
  Stack,
  Divider,
  Avatar,
  CardActionArea,
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import HeroTyping from './HeroTyping';

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://10.66.137.15:8000/api/news/')
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching articles:', err);
        setLoading(false);
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

    // Gradient overlay
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(30,60,114,0.7), rgba(42,82,152,0.85))',
      zIndex: 1,
    },

    // Smoke effect overlay
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '200%',
      height: '100%',
      backgroundImage: `url('/images/smoke.png')`, // make sure this image exists and has transparency
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


      {/* News Section */}
      <Container sx={{ py: 6 }}>
        <Section title="Latest News">
          {loading ? (
            <Typography>Loading articles...</Typography>
          ) : articles.length === 0 ? (
            <Typography>No articles available.</Typography>
          ) : (
            <Grid container spacing={4}>
              {articles.map((article) => (
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
