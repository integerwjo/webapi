import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Box,
} from "@mui/material";
import dayjs from "dayjs";

const TopTeamFixtures = ({ fixtures }) => {
  return (
    <Grid container spacing={2}>
      {fixtures.map((fixture) => (
        <Grid item xs={12} md={6} key={fixture.id}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Grid container alignItems="center" spacing={2}>
                {/* Team A */}
                <Grid item xs={5} textAlign="center">
                  <Avatar
                    src={fixture.team_a.logo}
                    alt={fixture.team_a.name}
                    sx={{ width: 60, height: 60, mx: "auto", mb: 1 }}
                  />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {fixture.team_a.name}
                  </Typography>
                </Grid>

                {/* VS */}
                <Grid item xs={2} textAlign="center">
                  <Typography variant="h6" fontWeight="bold">
                    VS
                  </Typography>
                </Grid>

                {/* Team B */}
                <Grid item xs={5} textAlign="center">
                  <Avatar
                    src={fixture.team_b.logo}
                    alt={fixture.team_b.name}
                    sx={{ width: 60, height: 60, mx: "auto", mb: 1 }}
                  />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {fixture.team_b.name}
                  </Typography>
                </Grid>
              </Grid>

              {/* Date & Venue */}
              <Box mt={2} textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  {dayjs(fixture.date).format("DD MMM YYYY • HH:mm")}
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  Venue: {fixture.venue}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopTeamFixtures;
