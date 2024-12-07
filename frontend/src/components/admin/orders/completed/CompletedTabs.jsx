import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Delivered from './Delivered';
import FailedDelivery from './FailedDelivery';
import Cancelled from './Cancelled';
import Rejected from './Rejected';

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

export default function CompletedTabs({ orders }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const deliveredOrders = orders.filter(
    (order) => order.status === 'Delivered'
  );
  const failedDeliveryOrders = orders.filter(
    (order) => order.status === 'Failed Delivery'
  );
  const cancelledOrders = orders.filter(
    (order) => order.status === 'Cancelled'
  );
  const rejectedOrders = orders.filter(
    (order) => order.status === 'Rejected'
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="completed tabs example"
          TabIndicatorProps={{
            style: { backgroundColor: '#ff5733' }, // Underline color
          }}
        >
          <Tab
            label="Delivered"
            {...a11yProps(0)}
            sx={{
              color: '#000', // Default text color
              '&.Mui-selected': {
                color: '#C70039', // Selected tab text color
              },
            }}
          />
          <Tab
            label="Failed Delivery"
            {...a11yProps(1)}
            sx={{
              color: '#000',
              '&.Mui-selected': {
                color: '#C70039',
              },
            }}
          />
          <Tab
            label="Cancelled"
            {...a11yProps(2)}
            sx={{
              color: '#000',
              '&.Mui-selected': {
                color: '#C70039',
              },
            }}
          />
          <Tab
            label="Rejected"
            {...a11yProps(3)}
            sx={{
              color: '#000',
              '&.Mui-selected': {
                color: '#C70039',
              },
            }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Delivered orders={deliveredOrders} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <FailedDelivery orders={failedDeliveryOrders} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Cancelled orders={cancelledOrders} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Rejected orders={rejectedOrders} />
      </CustomTabPanel>
    </Box>
  );
}
