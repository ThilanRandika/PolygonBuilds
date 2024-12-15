import React from 'react'

function OrderDetailsPreview({ order }) {
  return (
    <div>
      <h2>Order Details</h2>
      <p>Order ID: {order._id}</p>
    </div>
  )
}

export default OrderDetailsPreview