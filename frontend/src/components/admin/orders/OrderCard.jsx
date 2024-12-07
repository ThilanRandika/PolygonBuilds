import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import defaultImage from '../../../assets/images/default3DModel.png';

function OrderCard({ order }) {
  const {
    customerName,
    itemsCount,
    orderNumber,
    updateTime,
    productImage,
    productName,
    productDetails,
    price,
    quantity,
    status,
  } = order;

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', p: 2, boxShadow: 3, borderRadius: 2, my: 2 }}>
      {/* Order Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}></Avatar>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {customerName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Package ({itemsCount} Item)
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Order Number: <span style={{ fontWeight: 'bold' }}>{orderNumber}</span>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update Time: <span style={{ fontWeight: 'bold' }}>{updateTime}</span>
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Order Details */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          component="img"
          src={productImage || defaultImage} // Fallback to default image if productImage is null/undefined
          alt="Product"
          sx={{ width: 64, height: 64, borderRadius: 1 }}
        />
        <Box sx={{ flex: 2 }}>
          <Typography variant="body1" fontWeight="bold">
            {productName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {productDetails.colorFamily}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" color="grey" >
            Rs. {price}
          </Typography>
          <Typography variant="body1" color="error.main" fontWeight="bold">
            X {quantity}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button variant="outlined" color="primary" size="small">
              Logistic Status
            </Button>
            <Button variant="outlined" color="primary" size="small">
              More Action
            </Button>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Logistics and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Status: {status}
        </Typography>
      </Box>
    </Card>
  );
}

OrderCard.propTypes = {
  order: PropTypes.shape({
    customerName: PropTypes.string.isRequired,
    itemsCount: PropTypes.string.isRequired,
    orderNumber: PropTypes.string.isRequired,
    updateTime: PropTypes.string.isRequired,
    productImage: PropTypes.string,
    productName: PropTypes.string.isRequired,
    productDetails: PropTypes.shape({
      colorFamily: PropTypes.string.isRequired,
    }).isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default OrderCard;
