import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function SignUpForm() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};

    if (!form.fullName.trim()) tempErrors.fullName = 'Full name is required';
    if (!form.email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      tempErrors.email = 'Email is not valid';

    if (!form.password) tempErrors.password = 'Password is required';
    else if (form.password.length < 6)
      tempErrors.password = 'Password must be at least 6 characters';

    if (!form.confirmPassword)
      tempErrors.confirmPassword = 'Confirm your password';
    else if (form.confirmPassword !== form.password)
      tempErrors.confirmPassword = "Passwords don't match";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch('http://10.66.137.120:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.fullName,
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      // Store tokens in localStorage
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);

      alert('Account created & logged in!');
      setForm({ fullName: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((show) => !show);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, p: 4, borderRadius: 2, backgroundColor: 'background.paper' }}>
        <Typography component="h1" variant="h5" align="center" mb={3}>
          Create Account
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            margin="normal"
            error={!!errors.fullName}
            helperText={errors.fullName}
          />

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            type="email"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            type={showPassword ? 'text' : 'password'}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, backgroundColor: '#12414eff' }}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
