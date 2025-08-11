import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Avatar,
  Stack,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const tempErrors = {};
    if (!form.username) tempErrors.username = 'Username is required';
    if (!form.password) tempErrors.password = 'Password is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("username", form.username);
        // Redirect to home page on successful login
        navigate('/');
      } else {
        setErrors({ general: data.detail || "Invalid username or password" });
      }
    } catch (err) {
      setErrors({ general: "Server error, please try again." });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((show) => !show);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        //alignItems: 'center',
        px: 2,
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            p: 5,
            bgcolor: 'background.paper',
            borderRadius: 3,
            //boxShadow: '0 2px 5px rgba(0,0,0,0.09)',
          }}
        >
          <Stack direction="column" alignItems="center" spacing={2} mb={4}>
            <Avatar sx={{ bgcolor: '#12414eff', width: 56, height: 56 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight={600}>
              Sign In
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              maxWidth={300}
            >
              Please enter your details to sign in.
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Username"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              autoComplete="username"
              autoFocus
            />

            <TextField
              label="Password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {errors.general && (
              <Typography color="error" align="center" sx={{ mt: 1 }}>
                {errors.general}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, borderRadius: 1, fontWeight: 600, backgroundColor: '#12414eff' }}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mt: 1 }}
            >
              <Link href="#" variant="body2" underline="hover">
                Forgot password?
              </Link>
              <Link href="/sign-up" variant="body2" underline="hover">
                {"Don't have an account? Sign Up"}
              </Link>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
