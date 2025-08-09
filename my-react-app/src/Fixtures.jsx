import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Box,
  Avatar
} from '@mui/material';

const MatchFixtures = ({ fixtures }) => {
  return (
    <Grid container spacing={2} sx={{ width: '100%', margin: 0 }}>
      {fixtures.map((match, index) => (
        <Grid item xs={12} key={index}>
          <Card variant="outlined" sx={{ width: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                <Box display="flex" alignItems="center">
                  <Avatar src={match.team_a?.logo} alt={match.team_a?.name} sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">{match.team_a?.name}</Typography>
                </Box>
                <Typography>VS</Typography>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle1" sx={{ mr: 1 }}>{match.team_b?.name}</Typography>
                  <Avatar src={match.team_b?.logo} alt={match.team_b?.name} />
                </Box>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                {new Date(match.date).toLocaleString()} | {match.venue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MatchFixtures;
