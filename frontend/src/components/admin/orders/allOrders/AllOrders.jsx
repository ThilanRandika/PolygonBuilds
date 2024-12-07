import { Box, Typography } from '@mui/material'
import React from 'react'
import OrderCard from '../OrderCard'

function AllOrders({ orders }) {

  return (
    <div>
        <Box>
            <Typography>All Orders</Typography>
        </Box>
        {/* Order Cards */}
        <Box sx={{ p: 2, width: '100%' }}>
          {orders.map((order, index) => (
            <OrderCard key={index} order={order} />
          ))}
        </Box>
    </div>
  )
}

export default AllOrders