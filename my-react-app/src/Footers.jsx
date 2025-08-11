import React from 'react';
import { Box, Container, Typography, Stack, Link, IconButton, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        //background: 'linear-gradient(to right, #0f3540ff, #1a4b5aff)',
        backgroundColor:'#1f2937',
        color: 'white',
        py: 4,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          {/* Logo and Tagline */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <SportsSoccerIcon fontSize="large" />
            <Typography variant="h6" fontWeight={700}>
              Endebess Football League
            </Typography>
          </Stack>


          {/* Social Media Icons */}
          <Stack direction="row" spacing={1}>
            <IconButton
              aria-label="Facebook"
              href="https://facebook.com"
              target="_blank"
              rel="noopener"
              sx={{ color: 'white' }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              aria-label="Twitter"
              href="https://twitter.com"
              target="_blank"
              rel="noopener"
              sx={{ color: 'white' }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              aria-label="Instagram"
              href="https://instagram.com"
              target="_blank"
              rel="noopener"
              sx={{ color: 'white' }}
            >
              <InstagramIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Copyright */}
        <Typography
          variant="body2"
          color="rgba(255,255,255,0.7)"
          align="center"
          sx={{ fontSize: 14 }}
        >
          &copy; {new Date().getFullYear()} wanderajeff. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
