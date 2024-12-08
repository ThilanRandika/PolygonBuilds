import React from 'react'
import CompletedTabs from './CompletedTabs'

function Completed({ orders }) {
  return (
    <div>
        <CompletedTabs orders={orders} />
    </div>
  )
}

export default Completed