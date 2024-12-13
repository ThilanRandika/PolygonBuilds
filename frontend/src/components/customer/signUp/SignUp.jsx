import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import axios from 'axios'; // Add Axios for API requests

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

export default function SignUp() {
  const [formErrors, setFormErrors] = React.useState({});

  const validateInputs = (data) => {
    const errors = {};

    if (!data.first_name) {
      errors.first_name = 'First name is required.';
    }

    if (!data.last_name) {
      errors.last_name = 'Last name is required.';
    }

    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!data.mobile || data.mobile.length < 10) {
      errors.mobile = 'Mobile number must be at least 10 digits.';
    }

    if (!data.password || data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = {
      first_name: data.get('first_name'),
      last_name: data.get('last_name'),
      email: data.get('email'),
      mobile: data.get('mobile'),
      password: data.get('password'),
    };

    const errors = validateInputs(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8070/api/customer/register', formData);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'An error occurred during registration.');
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="center" alignItems="center">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="first_name">First Name</FormLabel>
              <TextField
                autoComplete="given-name"
                name="first_name"
                required
                fullWidth
                id="first_name"
                placeholder="Jon"
                error={!!formErrors.first_name}
                helperText={formErrors.first_name}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="last_name">Last Name</FormLabel>
              <TextField
                autoComplete="family-name"
                name="last_name"
                required
                fullWidth
                id="last_name"
                placeholder="Snow"
                error={!!formErrors.last_name}
                helperText={formErrors.last_name}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="mobile">Mobile</FormLabel>
              <TextField
                required
                fullWidth
                id="mobile"
                placeholder="1234567890"
                name="mobile"
                autoComplete="tel"
                variant="outlined"
                error={!!formErrors.mobile}
                helperText={formErrors.mobile}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
            </FormControl>

            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive updates via email."
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link href="/login" variant="body2" sx={{ alignSelf: 'center' }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </>
  );
}
