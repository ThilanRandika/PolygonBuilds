import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import QuotationPending from './QuotationPending';
import PaymentPending from './PaymentPending';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function PendingTabs({ orders }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Filter orders by status
  const QuotationPendingOrders = orders.filter(
    (order) => order.status === 'Quotation Pending'
  );  
  const paymentPendingOrders = orders.filter(
    (order) => order.status === 'Payment Pending'
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          TabIndicatorProps={{
            style: { backgroundColor: '#ff5733' }, // Underline color
          }}
          textColor="inherit"
        >
          <Tab
            label="Quotation Pending"
            {...a11yProps(0)}
            sx={{
              color: '#000', // Default color
              '&.Mui-selected': {
                color: '#C70039', // Selected tab color
              },
            }}
          />
          <Tab
            label="Payment Pending"
            {...a11yProps(1)}
            sx={{
              color: '#000', // Default color
              '&.Mui-selected': {
                color: '#C70039', // Selected tab color
              },
            }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <QuotationPending orders={QuotationPendingOrders} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PaymentPending orders={paymentPendingOrders} />
      </CustomTabPanel>
    </Box>
  );
}
