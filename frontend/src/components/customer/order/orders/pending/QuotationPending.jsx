import * as React from 'react';
import Box from '@mui/material/Box';
import OrderCard from '../OrderCard';

function QuotationPending({ orders }) {
  return (
    <div>
        {/* Order Cards */}
        <Box sx={{ p: 2, width: '100%' }}>
          {orders.map((order, index) => (
            <OrderCard key={index} order={order} />
          ))}
        </Box>
    </div>
  );
}

export default QuotationPending;
