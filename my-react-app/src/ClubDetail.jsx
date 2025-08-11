import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const ClubDetailsCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/clubs/${id}/`)
      .then(res => res.json())
      .then(setTeam)
      .catch(console.error);
  }, [id]);

  if (!team) return <Typography align="center">Loading...</Typography>;

  const { name, logo, coach, players = [], top_scorer } = team;

  return (
    <Box maxWidth={1000} margin="auto">
      {/* Club Header */}
      <Card
        sx={{
          borderRadius: 1,
          border: '1px solid #e0e0e0',
          boxShadow: 'none',
          backgroundColor: '#fafafa',
          mb: 4,
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={3} mb={3} flexWrap="wrap">
            <Avatar
              src={logo}
              alt={name}
              sx={{
                width: 80,
                height: 80,
                border: '2px solid #e0e0e0',
                backgroundColor: '#fff',
              }}
            />
            <Typography variant="h5" fontWeight={700}>
              {name}
            </Typography>
          </Box>

          <Typography variant="subtitle2" color="text.secondary">
            Coach
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {coach || 'N/A'}
          </Typography>
        </CardContent>
      </Card>

      {/* Top Scorer Card */}
      {top_scorer && (
        <Card
          onClick={() => navigate(`/players/${top_scorer.id}`)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            mb: 4,
            maxWidth: 400,
            borderRadius: 1,
            backgroundColor: '#fafafa',
            cursor: 'pointer',
            transition: 'transform 0.2s',
        
          }}
        >
          <Avatar
            src={
              top_scorer.photo?.startsWith('http')
                ? top_scorer.photo
                : `http://10.66.137.120:8000${top_scorer.photo}`
            }
            alt={top_scorer.name}
            sx={{ width: 64, height: 64, mr: 2 }}
          />
    
          <CardContent sx={{ p: 0 }} >
            <Typography variant="subtitle2" color="text.secondary">
              Top Scorer
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {top_scorer.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                backgroundColor: '#e0f7fa',
                color: '#006064',
                px: 1,
                py: 0.3,
                borderRadius: 2,
                display: 'inline-block',
                fontWeight: 500,
              }}
            >
              {top_scorer.stat} goals
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Squad List */}
      <Card
        sx={{
          borderRadius: 1,
          border: '1px solid #e0e0e0',
          boxShadow: 'none',
          backgroundColor: '#fafafa',
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Squad
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Position</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {players.map((player, index) => (
                  <TableRow
                    key={player.id || index}
                    hover
                    onClick={() => navigate(`/players/${player.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {player.photo && (
                          <Avatar src={player.photo} alt={player.name} sx={{ width: 30, height: 30, mr: 1 }} />
                        )}
                        {player.name}
                      </Box>
                    </TableCell>
                    <TableCell>{player.position}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClubDetailsCard;
