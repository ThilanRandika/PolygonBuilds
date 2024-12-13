import React from 'react'
import PendingTabs from './PendingTabs'

function Pending({ orders }) {
  return (
    <div>
        <PendingTabs orders={orders} />
    </div>
  )
}

export default Pending