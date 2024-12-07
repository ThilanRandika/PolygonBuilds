import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Processing from './processing/Processing';
import Pending from './pending/Pending';
import Completed from './completed/Completed';
import { Link } from '@mui/material';
import AllOrders from './allOrders/AllOrders';

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

export default function OrderTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Function to handle "All Orders" link click
  const handleAllOrdersClick = (event) => {
    event.preventDefault();
    setValue(3); // Assuming 3 is the index for the "All Orders" tab
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Link for All Orders */}
      <Box sx={{ ml: 'auto', mr: 1, width: 80, mb: 2 }}>
        <Link href="#" underline="none" onClick={handleAllOrdersClick}>
          {'All Orders'}
        </Link>
      </Box>

      {/* Tabs for navigation */}
      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="fullWidth"
          textColor="inherit"
          centered
          TabIndicatorProps={{
            style: { backgroundColor: '#ff5733 ' },
          }}
          
        >
          <Tab label="Pending" {...a11yProps(0)} sx={{ bgcolor: 'white', borderRadius: '10px', mx: 1 }} />
          <Tab label="Processing" {...a11yProps(1)} sx={{ bgcolor: 'white', borderRadius: '10px', mx: 1 }} />
          <Tab label="Completed" {...a11yProps(2)} sx={{ bgcolor: 'white', borderRadius: '10px', mx: 1 }} />
          <Tab label="All Orders" {...a11yProps(3)} sx={{ display: 'none' }} /> {/* Hidden tab for All Orders */}
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <CustomTabPanel value={value} index={0}>
        <Pending />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Processing />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Completed />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <AllOrders />
      </CustomTabPanel>
    </Box>
  );
}
