import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
} from '@mui/material';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8070/api/order/all-orders');
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
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        All Orders
      </Typography>
      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Material</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Quality</TableCell>
                <TableCell>Infill Type</TableCell>
                <TableCell>Vertical Resolution</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Special Instructions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.material}</TableCell>
                  <TableCell>{order.color}</TableCell>
                  <TableCell>{order.quality}</TableCell>
                  <TableCell>{order.infilType}</TableCell>
                  <TableCell>{order.verticalResolution}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleString()}</TableCell>
                  <TableCell>{order.specialInstructions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Orders;
