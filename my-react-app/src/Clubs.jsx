import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Clubs = ({ data }) => {
  const navigate = useNavigate();

  const handleRowClick = (team) => {
    navigate(`/clubs/${team.id}`);
  };

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table sx={{ minWidth: 650 }} aria-label="teams and coaches table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell><strong>#</strong></TableCell>
            <TableCell><strong>Team</strong></TableCell>
            <TableCell><strong>Coach</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((team, index) => (
            <TableRow
              key={team.id || index}
              hover
              onClick={() => handleRowClick(team)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  {team.logo && (
                    <Avatar src={team.logo} alt={team.name} sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body1">{team.name}</Typography>
                </Box>
              </TableCell>
              <TableCell>{team.coach}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Clubs;
