import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderTabs from './OrderTabs';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Link,
} from '@mui/material';

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8070/api/adminOrder/all-orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) return <CircularProgress />; // Show loading spinner while fetching data

  if (error) return <p>{error}</p>; // Show error message if there's an error

  return (
    <>
      <div>
        <div>
          <Typography variant="h4" gutterBottom>
            Order Management
          </Typography>
        </div>
        
        <div>
          <OrderTabs orders={orders} />
        </div>
      </div>
    </>
  );
};

export default OrdersDashboard;
