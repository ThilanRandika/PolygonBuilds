import React, { useState } from "react";
import { TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import axios from "axios";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Link } from '@mui/material';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../../firebase/firebaseConfig';  // Ensure firebase is correctly configured
import FDM from "./FDM";
import SLA from "./SLA";


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



const AdminCustomizationForm = ({ selectedProcess, setSelectedProcess, onCustomizationChange }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedProcess(newValue === 0 ? "FDM" : "SLA"); // Update process type based on tab
  };


  return (
    <div>
      <Typography variant="h5" gutterBottom>Customize Selection Options</Typography>

      

      <Box sx={{ width: '100%' }}>
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
          <Tab label="FDM" {...a11yProps(0)} sx={{ bgcolor: 'white', borderRadius: '10px', mx: 1 }} />
          <Tab label="SLA" {...a11yProps(1)} sx={{ bgcolor: 'white', borderRadius: '10px', mx: 1 }} />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <CustomTabPanel value={value} index={0}>
        <FDM onCustomizationChange={onCustomizationChange} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <SLA onCustomizationChange={onCustomizationChange} />
      </CustomTabPanel>
    </Box>


    </div>
  );
};

export default AdminCustomizationForm;
