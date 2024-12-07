import { Box, Typography } from '@mui/material'
import React from 'react'
import OrderCard from '../OrderCard'

function AllOrders() {
  const orderData = {
    customerName: 'Sandaru Weerasekara',
    itemsCount: '1',
    orderNumber: '217420687896485',
    updateTime: '02 Dec 2024 12:09',
    // productImage: '/path/to/cable-image.png',
    productName: 'basket 3D model',
    productDetails: {
      colorFamily: 'Color Family: Grey'
    },
    price: 1056.0,
    quantity: 2,
    status: 'Quotation Pending',
  };

  return (
    <div>
        <Box>
            <Typography>All Orders</Typography>
        </Box>
        <OrderCard order={orderData} />
    </div>
  )
}

export default AllOrders