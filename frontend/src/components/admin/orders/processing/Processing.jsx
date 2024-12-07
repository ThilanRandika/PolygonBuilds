import React from 'react'
import ProcessingTabs from './ProcessingTabs'

function Processing({ orders }) {
  return (
    <div>
        <ProcessingTabs orders={orders} />
    </div>
  )
}

export default Processing