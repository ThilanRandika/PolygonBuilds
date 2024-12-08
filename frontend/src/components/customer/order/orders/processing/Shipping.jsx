import { Box } from '@mui/material'
import React from 'react'
import OrderCard from '../OrderCard'

function Shipping({ orders }) {
  return (
    <div>
        {/* Order Cards */}
        <Box sx={{ p: 2, width: '100%' }}>
          {orders.map((order, index) => (
            <OrderCard key={index} order={order} />
          ))}
        </Box>
    </div>
  )
}

export default Shipping