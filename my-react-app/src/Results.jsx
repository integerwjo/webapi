import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Container,
} from '@mui/material';

const MatchResults = ({ results }) => {
  const getInitials = (name) =>
    !name ? '?' : (name.trim().split(' ').map(w => w[0]).join('') || '?').toUpperCase();

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {results.map((match, i) => (
          <Grid item xs={12} sm={12} md={6} key={i}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                borderColor: '#e0e0e0',
                backgroundColor: 'background.paper',
                transition: 'border-color 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                {/* Teams + Score */}
                <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap">
                  
                  {/* Team A */}
                  <Box display="flex" alignItems="center" flex={1} minWidth={0}>
                    <Avatar
                      sx={{ bgcolor: 'primary.main', width: 42, height: 42, fontSize: 18, mr: 1 }}
                      src={match.team_a?.logo}
                      alt={match.team_a?.name || ''}
                    >
                      {!match.team_a?.logo && getInitials(match.team_a?.name)}
                    </Avatar>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      noWrap
                    >
                      {match.team_a?.name}
                    </Typography>
                  </Box>

                  {/* Score */}
                  <Typography
                    variant="h6"
                    fontWeight="900"
                    sx={{ mx: 2, color: 'text.primary', flexShrink: 0 }}
                  >
                    {match.score_a ?? '-'} : {match.score_b ?? '-'}
                  </Typography>

                  {/* Team B */}
                  <Box display="flex" alignItems="center" flex={1} justifyContent="flex-end" minWidth={0}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      noWrap
                      sx={{ mr: 1 }}
                    >
                      {match.team_b?.name}
                    </Typography>
                    <Avatar
                      sx={{ bgcolor: 'primary.main', width: 42, height: 42, fontSize: 18 }}
                      src={match.team_b?.logo}
                      alt={match.team_b?.name || ''}
                    >
                      {!match.team_b?.logo && getInitials(match.team_b?.name)}
                    </Avatar>
                  </Box>
                </Box>

                {/* Date & Venue */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 1 }}
                >
                  {new Date(match.date).toLocaleString([], {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  | {match.venue}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MatchResults;
