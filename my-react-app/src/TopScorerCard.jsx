import React from 'react';
import { Card, CardContent, Avatar, Typography, Box } from '@mui/material';

const TopScorerCard = ({ player }) => {
  if (!player) return null;

  return (
    <Card
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
        //borderRadius: 3,
        border: '1px solid #fdd835',
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={player.photo}
          alt={player.name}
          sx={{ width: 64, height: 64, border: '2px solid #fbc02d' }}
        />
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            🌟 Top Scorer
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            {player.name}
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {player.stat} Goals
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TopScorerCard;
