import React from 'react';
import {
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const News = ({ articles }) => {
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/news/${id}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        fontWeight={800}
        mb={5}
        textAlign="center"
        sx={{ letterSpacing: 1 }}
      >
        Latest Sports News
      </Typography>

      <Stack spacing={4} alignItems="center">
        {articles.map((article) => (
          <Card
            key={article.id}
            onClick={() => handleCardClick(article.id)}
            sx={{
              width: '100%',
              maxWidth: 550,
              borderRadius: 1,
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 0.5px 1px rgba(0,0,0,0.7)',
              },
            }}
          >
            <CardActionArea>
              {article.image && (
                <CardMedia
                  component="img"
                  height="260"
                  image={article.image}
                  alt={article.title}
                  sx={{
                    objectFit: 'cover',
                  }}
                />
              )}
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
                >
                  {article.date}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  mt={1}
                  sx={{ lineHeight: 1.3 }}
                >
                  {article.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mt: 1 }}
                >
                  {article.summary}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default News;
