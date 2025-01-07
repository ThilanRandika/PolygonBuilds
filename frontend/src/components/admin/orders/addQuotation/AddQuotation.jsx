import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AddQuotationForm from './AddQuotationForm';
import OrderDetailsPreview from './OrderDetailsPreview';
import { CircularProgress, Typography, Box, Grid2 } from '@mui/material';

function AddQuotation() {
  const { id } = useParams(); // Get the order ID from the URL
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/adminOrder/order/${id}`);
        console.log('API Response:', response.data);
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Add Quotation for Order
      </Typography>

      <Grid2 container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid2 size={6}>
          {/* Add Quotation Form */}
          <AddQuotationForm orderId={id} />
        </Grid2>
        <Grid2 size={6}>
          {/* Display Order Details */}
          <OrderDetailsPreview order={order} />
        </Grid2>
      </Grid2>
      
    </Box>
  );
}

export default AddQuotation;
