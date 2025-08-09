import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Avatar,
  Typography, Box, useTheme, useMediaQuery
} from '@mui/material';

const ScoreboardTable = ({ teams }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <TableContainer component={Paper} elevation={0} sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: isMobile ? 650 : 900 }} aria-label="league table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#e8f0fe' }}>
            <TableCell><strong>#</strong></TableCell>
            <TableCell><strong>Team</strong></TableCell>
            <TableCell align="center"><strong>MP</strong></TableCell>
            <TableCell align="center"><strong>W</strong></TableCell>
            <TableCell align="center"><strong>D</strong></TableCell>
            <TableCell align="center"><strong>L</strong></TableCell>
            {!isMobile && <TableCell align="center"><strong>GF</strong></TableCell>}
            {!isMobile && <TableCell align="center"><strong>GA</strong></TableCell>}
            {!isMobile && <TableCell align="center"><strong>GD</strong></TableCell>}
            <TableCell align="center"><strong>Pts</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow key={team.id || index} hover>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  {team.club.logo && (
                    <Avatar src={team.club.logo} alt={team.club.name} sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body1">
                    {team.club.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center">{team.played}</TableCell>
              <TableCell align="center">{team.wins}</TableCell>
              <TableCell align="center">{team.draws}</TableCell>
              <TableCell align="center">{team.losses}</TableCell>
              {!isMobile && (
                <TableCell align="center">{team.goals_for}</TableCell>
              )}
              {!isMobile && (
                <TableCell align="center">{team.goals_against}</TableCell>
              )}
              {!isMobile && (
                <TableCell align="center">{team.goal_difference}</TableCell>
              )}
              <TableCell align="center">{team.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ScoreboardTable;
