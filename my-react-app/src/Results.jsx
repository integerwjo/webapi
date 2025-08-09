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
    <Container maxWidth={false} disableGutters sx={{ width: '100vw', mt: 2 }}>
      <Box px={2}>
        <Grid container spacing={2}>
          {results.map((match, i) => (
            <Grid item xs={12} key={i}>
              <Card sx={{ width: '100%', borderRadius: 1, boxShadow: 1, overflow: 'hidden' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    {/* Team A */}
                    <Box display="flex" alignItems="center" flex="1" minWidth={0}>
                      <Avatar
                        sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontSize: 18 }}
                        src={match.team_a?.logo}
                        alt={match.team_a?.name || ''}
                      >
                        {!match.team_a?.logo && getInitials(match.team_a?.name)}
                      </Avatar>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        noWrap
                        sx={{ ml: 1 }}
                      >
                        {match.team_a?.name}
                      </Typography>
                    </Box>

                    {/* Score */}
                    <Box mx={1} flexShrink={0}>
                      <Typography variant="h6" fontWeight="900" align="center">
                        {match.score_a ?? '-'} : {match.score_b ?? '-'}
                      </Typography>
                    </Box>

                    {/* Team B */}
                    <Box display="flex" alignItems="center" flex="1" justifyContent="flex-end" minWidth={0}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        noWrap
                        sx={{ mr: 1 }}
                      >
                        {match.team_b?.name}
                      </Typography>
                      <Avatar
                        sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontSize: 18 }}
                        src={match.team_b?.logo}
                        alt={match.team_b?.name || ''}
                      >
                        {!match.team_b?.logo && getInitials(match.team_b?.name)}
                      </Avatar>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    {new Date(match.date).toLocaleString()} | {match.venue}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default MatchResults;
