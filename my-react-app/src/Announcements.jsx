import React, { useState } from 'react';

import {
  Container, Box, Grid, Card, CardContent,
  CardActions, Typography, Button, Pagination, Alert
} from '@mui/material';

function AnnouncementsPage({ announcements, featured }) {
  const [page, setPage] = useState(1);
  const perPage = 6;
  const pageCount = Math.ceil(announcements.length / perPage);
  const currentList = announcements.slice((page - 1) * perPage, page * perPage);

  return (

    <Container maxWidth="md">
      {/* Optional featured alert/banner */}
      {featured && (
        <Box my={3}>
          <Alert severity="info">
            <Typography variant="h6">{featured.title}</Typography>
            <Typography variant="body2">{featured.message}</Typography>
            <Button size="small" onClick={featured.onClick}>Learn more</Button>
          </Alert>
        </Box>
      )}

      {/* Grid of announcement cards */}
      <Grid container spacing={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , mt: 2 }}>
        {currentList.map((item) => (
          <Grid item xs={12} md={6} key={item.id} sx={{ width: '100%' }}>
            <Card sx={{textAlign: 'center'}} elevation={2}>
              <CardContent>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {item.date}
                </Typography>
                <Typography variant="body2" paragraph>
                  {item.content || item.description.slice(0, 150) + '…'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" href={item.url || '#'}>Read More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination controls */}
      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" my={4}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, p) => setPage(p)}
          />
        </Box>
      )}
    </Container>
  );
}

export default AnnouncementsPage;
