import React from 'react'
import { Route, Routes } from 'react-router-dom'
import OrdersDashboard from './OrdersDashboard'
import AddQuotation from './addQuotation/AddQuotation'

function Orders() {
  return (
    <div>
      <Routes>
      <Route path="/" element={<OrdersDashboard />} />
      <Route path="/:id/addQuotation" element={<AddQuotation />} />   
      </Routes>
    </div>
  )
}

export default Orders