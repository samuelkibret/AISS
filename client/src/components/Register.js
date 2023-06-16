import React, { useState } from 'react';
import { TextField, Button, Link, Grid, Paper, Typography, Select, MenuItem, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

import NavBar from './landingPage/NavBar';
import Footer from './landingPage/Footer';

import axios from 'axios';
const theme = createTheme();

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState(null); // New state for file upload
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);
      formData.append('role', role);
      formData.append('image', image); // Include file in form data

      const response = await axios.post('/user/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setSuccess(true);
        setError('');
        navigate('/sign-in');
      }
    } catch (error) {
      setSuccess(false);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred during registration.');
      }
    }
  };

 
  return (
    <div>
      <NavBar />
      <ThemeProvider theme={theme}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={8}>
            <Paper elevation={5} sx={{ padding: '20px', margin: '5rem auto' }}>
              <Typography variant="h4" align="center" gutterBottom>
                Register
              </Typography>
              <form onSubmit={handleSubmit}>
                {success && <p>User registered successfully.</p>}
                {error && <p>{error}</p>}
                
                <TextField
                  type="email"
                  label="Email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  required
                />
                <TextField
                  label="Username"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  margin="normal"
                  required
                />
                <Select
                  labelId="select-label"
                  id="select-input"
                  fullWidth
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  label="Select_Role"
                  required
                >
                  <MenuItem default value="option1">
                    Select Role
                  </MenuItem>
                  <MenuItem value="option1">Option 1</MenuItem>
                  <MenuItem value="option2">Option 2</MenuItem>
                  <MenuItem value="option3">Option 3</MenuItem>
                </Select>

                <TextField
                  type="password"
                  label="Password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  required
                />
                <TextField
                  type="password"
                  label="Confirm Password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  margin="normal"
                  required
                />
                <input
                  accept="image/*"
                  type="file"
                  id="file"
                  style={{ display: 'none' }}
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <label htmlFor="file">
                  <Button component="span" startIcon={<CloudUploadOutlinedIcon />} fullWidth>
                    Upload Image
                  </Button>
                </label>
                {image && (
                  <Typography variant="body2" align="center">
                    Selected image: {image.name}
                  </Typography>
                )}
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Register
                </Button>
              </form>
              <Typography variant="body2" align="center" marginTop="10px">
                Already Registered?{' '}
                <Link href="/sign-in">
                  Login
                </Link>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </ThemeProvider>
      <Footer />
    </div>
  );
};

export default Register;
