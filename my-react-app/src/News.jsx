import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';



const News = ({ articles }) => {
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/news/${id}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h5" fontWeight={700} mb={4} textAlign="center">
        Latest Sports News
      </Typography>

      <Stack spacing={4} alignItems="center">
        {articles.map((article) => (
          <Box
            Container
            key={article.id}
            elevation = {3}
            onClick={() => handleCardClick(article.id)}
            sx={{
              width: '100%',
              maxWidth: 500, // <<< Solid, visible border
              borderRadius: 1,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease,  0.2s ease',
              borderBox:'2px 2px 2px #ddd',
              border:'1.5px solid purple',
          
            }}
          >
            <CardActionArea>
                <Box sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {article.date}
                </Typography>
                <Typography variant="h6" fontWeight={600} mt={1}>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {article.summary}
                </Typography>
              </Box>
              {article.image && (
                <CardMedia
                  component="img"
                  minHeight={{ xs: 220, sm: 280, md: 320 }}
                  image={article.image}
                  alt={article.title}
                />
              )}

            </CardActionArea>
          </Box>
        ))}
      </Stack>
    </Container>
  );
};

export default News;
