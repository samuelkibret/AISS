import React, { useRef, useState, useEffect } from 'react';
import { TextField, Checkbox, Button, FormControlLabel, Grid, Paper, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './landingPage/NavBar';
import Footer from './landingPage/Footer';

import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
// import { useAuthContext } from '..context/useAuthContext'
const theme = createTheme();

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { dispatch } = useAuthContext()
  const userRef = useRef();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3005/user/login', {
        email,
        password,
        rememberMe,
      });

      if (response.status === 201) {
        const { token } = response.data;
        const { data: user } = response.data;

        // Save the token in localStorage or cookies for future requests
        localStorage.setItem('token', token);
        // update the auth context
        dispatch({type: 'LOGIN', payload: user})
        setSuccess(true);
        setError('');
        console.log(user)
        // Redirect to the "melkamu" component
        navigate('/agri-jobs');
      }
    } catch (error) {
      setSuccess(false);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while logging in.');
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={5} sx={{ padding: '20px', margin: '5rem auto' }}>
            <Typography variant="h4" align="center" gutterBottom>
              Login
            </Typography>
            <form onSubmit={handleSubmit}>
              {success && <p>Logged in successfully.</p>}
              {error && <p>{error}</p>}
              <TextField
                label="Email"
                fullWidth
                inputRef={userRef}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember Me"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
              </Button>
            </form>
            <Link to="#" onClick variant="body2" align="center" style={{ marginRight: '2rem', textDecoration: 'none' }}>
              Forgot Password?
            </Link>
            <Link to="/sign-up" variant="body2" align="center" style={{ marginLeft: '0.1rem', textDecoration: 'none' }}>
              No Account? Register
            </Link>
          </Paper>
        </Grid>
      </Grid>
      <Footer />
    </ThemeProvider>
  );
};

export default Login;
