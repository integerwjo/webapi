import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Divider,
  Slide,
  Avatar,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import HomeIcon from '@mui/icons-material/Home';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import EventIcon from '@mui/icons-material/Event';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import TableChartIcon from '@mui/icons-material/TableChart';
import GroupIcon from '@mui/icons-material/Group';
import ChatIcon from '@mui/icons-material/Chat';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

import { Link as RouterLink, useNavigate } from 'react-router-dom';

const iconMap = {
  Home: <HomeIcon />,
  News: <NewspaperIcon />,
  Fixtures: <EventIcon />,
  Results: <SportsScoreIcon />,
  'League Table': <TableChartIcon />,
  Clubs: <GroupIcon />,
  Chat: <ChatIcon />,
  'Sign in': <LoginIcon />,
  Logout: <LogoutIcon />,
};

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const token = localStorage.getItem('access'); // Check if user is logged in

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/'); // Redirect after logout
  };

  // Base nav items (without sign in / logout / chat)
  const baseNavItems = [
    { label: 'Home', path: '/' },
    { label: 'News', path: '/news' },
    { label: 'Fixtures', path: '/fixtures' },
    { label: 'Results', path: '/results' },
    { label: 'League Table', path: '/league-table' },
    { label: 'Clubs', path: '/clubs' },
  ];

  // Build final nav items array
  let navItems = [...baseNavItems];

  if (token) {
    navItems.push({ label: 'Chat', path: '/chat' });
    navItems.push({ label: 'Logout', action: handleLogout });
  } else {
    navItems.push({ label: 'Sign in', path: '/sign-in' });
  }

  const drawerContent = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        px: 2,
        pt: 3,
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <SportsSoccerIcon />
          </Avatar>
          <Typography variant="h6" fontWeight={600}>
            EFL
          </Typography>
        </Box>
        <Divider />
        <List sx={{ mt: 2 }}>
          {navItems.map(({ label, path, action }) => (
            <ListItem key={label} disablePadding>
              {action ? (
                <ListItemButton
                  onClick={action}
                  sx={{
                    borderRadius: 1,
                    py: 1.5,
                    px: 2,
                    my: 0.5,
                    transition: '0.15s',
                    '&:hover': {
                      backgroundColor: '#12414eff',
                      color: 'white',
                    },
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {iconMap[label] && (
                    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                      {iconMap[label]}
                    </Box>
                  )}
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '1rem',
                    }}
                  />
                </ListItemButton>
              ) : (
                <ListItemButton
                  component={RouterLink}
                  to={path}
                  sx={{
                    borderRadius: 1,
                    py: 1.5,
                    px: 2,
                    my: 0.5,
                    transition: '0.15s',
                    '&:hover': {
                      backgroundColor: '#12414eff',
                      color: 'white',
                    },
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {iconMap[label] && (
                    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                      {iconMap[label]}
                    </Box>
                  )}
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '1rem',
                    }}
                  />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
      </Box>
      <Box textAlign="center" fontSize="0.8rem" pb={2} color="text.secondary">
        © {new Date().getFullYear()} Integer
      </Box>
    </Box>
  );

  return (
    <>
      <Slide in direction="down" timeout={500}>
        <AppBar
          elevation={3}
          position="sticky"
          sx={{
            //background: 'linear-gradient(to right, #0f3540ff, #1a4b5aff)',
            backgroundColor:'#1f2937',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              ⚽ EFL
            </Typography>

            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  edge="end"
                  onClick={toggleDrawer(true)}
                  aria-label="menu"
                >
                  <MenuRoundedIcon />
                </IconButton>
                <Drawer
                  anchor="right"
                  open={drawerOpen}
                  onClose={toggleDrawer(false)}
                  PaperProps={{
                    sx: {
                      border: 'none',
                    },
                  }}
                >
                  {drawerContent}
                </Drawer>
              </>
            ) : (
              <Box display="flex" gap={1}>
                {navItems.map(({ label, path, action }) =>
                  action ? (
                    <Button
                      key={label}
                      onClick={action}
                      color="inherit"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '1rem',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.15)',
                        },
                      }}
                    >
                      {label}
                    </Button>
                  ) : (
                    <Button
                      key={label}
                      component={RouterLink}
                      to={path}
                      color="inherit"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '1rem',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.15)',
                        },
                      }}
                    >
                      {label}
                    </Button>
                  )
                )}
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </Slide>
    </>
  );
};

export default NavBar;

