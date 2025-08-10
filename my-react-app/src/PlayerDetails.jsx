import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Grid,
  Box,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const PlayerDetailsCard = () => {

  const { id } = useParams(); 
  const [player, setPlayer] = useState()

  useEffect(() => {
    fetch(`http://localhost:8000/api/players/${id}/`)
      .then(res => res.json())
      .then(data => setPlayer(data))
      .catch(err => console.error('Failed to fetch club:', err));
  }, [id]);

  if (!player) return null;

  const {
            name,
            position,
            number,
            age,
            height,
            nationality,
            photo,
            foot,
            club,
            club_name,
            stats,
  } = player;

  return (
    <Card
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 4,
        boxShadow: 'none',
        maxWidth: 700,
        mx: 'auto',
        backgroundColor: '#fefefe',
        p: 5, // generous padding
      }}
    >
      <CardContent>
        <Grid container spacing={8} alignItems="center">
          {/* Avatar */}
          <Grid item xs={12} sm={4}>
            <Avatar
              src={photo}
              alt={name}
              sx={{
                width: 160,
                height: 160,
                mx: 'auto',
                border: '1px solid #1060ffff',
              }}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {name}
            </Typography>

            <Stack direction="row" spacing={3} mb={3}>
              <Chip label={position} sx={{backgroundColor:'#12414eff',color:'white'}} size="medium" />
              {foot && <Chip label={`${foot}-footed`} variant="outlined" size="medium" />}
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="body1" color="text.secondary">
                Club: <strong>{club_name ?? '—'}</strong>
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Jersey Number: <strong>{number ?? '—'}</strong>
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Age: <strong>{age ?? '—'}</strong> years
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Height: <strong>{height ?? '—'}</strong> cm
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Nationality: <strong>{nationality ?? '—'}</strong>
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        {/* Divider */}
        <Box my={6}>
          <Divider />
        </Box>

        {/* Player Stats Section */}
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Player Stats
          </Typography>

          <Grid container spacing={6}>
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Appearances
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {stats.appearances ?? '—'}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Goals
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {stats.goals ?? '—'}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Assists
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {stats.assists ?? '—'}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Yellow Cards
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {stats.yellow_cards ?? '—'}
              </Typography>
            </Grid>

            {/* Red Cards aligned without extra margin */}
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Red Cards
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {stats.red_cards ?? '—'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PlayerDetailsCard;


