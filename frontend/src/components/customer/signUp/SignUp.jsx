import React, { useState } from 'react';
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
import axios from 'axios';
import ModelModal from './ModelModel';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
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
  const [formErrors, setFormErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [userModels, setUserModels] = useState([]); // List of user models
  const [userEmail, setUserEmail] = useState(''); // State to store user's email
  const navigate = useNavigate()

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

  const handleModalClose = () => {
    setShowModal(false);
    handleDeleteAllModels();
    // Redirect to sign-in page when modal is closed
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
      setUserEmail(formData.email); // Store the email in state

      const response = await axios.post('http://localhost:8070/api/customer/register', formData);
      
      alert(response.data.message);
      // Fetch user's models based on their email
      const modelsResponse = await axios.get(`http://localhost:8070/api/file/models?email=${formData.email}`);
      if (modelsResponse.data.models.length > 0) {
        setUserModels(modelsResponse.data.models);
        setShowModal(true);
      }else {
        navigate('/signin')
      }
      //registration success


    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'An error occurred during registration.');
    }
  };

const handleAddToCart = async (modelId, modelLink, imageUrl) => {
  setUserModels((prevModels) => prevModels.filter((model) => model._id !== modelId));
  try {
    // Default values for required fields
    const defaultCartData = {
      user_id: "user123", // Replace with actual user ID (e.g., from context or session)
      model: modelLink,
      image: imageUrl,
      quantity: 1,
      material: "PLA", // Default material
      color: "White", // Default color
      quality: "Standard", // Default quality
      specialInstructions: "None", // Default special instructions
      infilType: "Grid", // Default infill type
      verticalResolution: "0.2mm", // Default resolution
      process: "FDM", // Default process
      finish: "Matte", // Default finish
      fileUnits: "mm", // Default file units
      infill: "20%", // Default infill percentage
      layerHeight: "0.2mm", // Default layer height
      technicalDrawing: "Not required", // Default technical drawing
      printOrientation: "Auto", // Default orientation
      tolerance: "0.1mm", // Default tolerance
      cosmeticSide: "None", // Default cosmetic side
      industryDescription: "General", // Default description
      hardnessDescription: "Standard", // Default hardness
    };

    // Send API request to add to cart
    const response = await axios.post("http://localhost:8070/api/cart/add", defaultCartData);

    if (response.status === 201) {
      console.log("Model added to cart successfully:", response.data.order);
      // Handle success (e.g., update UI or notify user)

      // After successfully adding to cart, delete the file from the File collection
      const deleteResponse = await axios.delete(`http://localhost:8070/api/file/deleteFile/${modelId}`);
      if (deleteResponse.status === 200) {
        console.log("File deleted successfully:", deleteResponse.data.message);
        // Notify user of success if necessary
      } else {
        console.error("Failed to delete file:", deleteResponse.data.error);
      }

    } else {
      console.error("Failed to add model to cart:", response.data.error);
    }
  } catch (error) {
    console.error("Error adding model to cart:", error.response?.data || error.message);
  }
};


const handleRemoveModel = async (modelId) => {
  setUserModels((prevModels) => prevModels.filter((model) => model._id !== modelId));
  try {
    // Call the API to delete the model from the database
    const deleteResponse = await axios.delete(`http://localhost:8070/api/file/deleteFile/${modelId}`);
    
    if (deleteResponse.status === 200) {
      console.log("File deleted successfully:", deleteResponse.data.message);

      // Update the local state to remove the model from the UI
      setUserModels((prevModels) => prevModels.filter((model) => model.id !== modelId));
    } else {
      console.error("Failed to delete file:", deleteResponse.data.error);
    }
  } catch (error) {
    console.error("Error deleting file:", error.response?.data || error.message);
  }
};

const handleDeleteAllModels = async () => {
  setUserModels(null);
  try {
    const response = await axios.delete('http://localhost:8070/api/file/deleteAll', {
      data: { email: userEmail }, // Include email in the request body
    });

    if (response.status === 200) {
      console.log('All models deleted successfully');
      setUserModels([]); // Clear userModels in the UI
      navigate('/signin')
    } else {
      console.error('Failed to delete all models:', response.data);
    }
  } catch (error) {
    console.error('Error deleting all models:', error.response?.data || error.message);
  }
};



  return (
    <>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="center" alignItems="center">
        <StyledCard variant="outlined">
          <Typography component="h1" variant="h4" sx={{ fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="first_name">First Name</FormLabel>
              <TextField
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
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
            </FormControl>

            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive updates via email."
            />
            <Button type="submit" fullWidth variant="contained">
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ textAlign: 'center' }}>
            <Typography>
              Already have an account?{' '}
              <Link href="/login" variant="body2">
                Sign in
              </Link>
            </Typography>
          </Box>
        </StyledCard>

        <ModelModal
          open={showModal}
          onClose={handleModalClose}
          userModels={userModels}
          handleAddToCart={handleAddToCart}
          handleRemoveModel={handleRemoveModel}
          handleDeleteAllModels={handleDeleteAllModels}
        />
      </SignUpContainer>
    </>
  );
}
