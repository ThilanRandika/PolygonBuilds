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



const AdminCustomizationForm = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const [materials, setMaterials] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [colors, setColors] = useState([]);

  const [newMaterial, setNewMaterial] = useState({ name: "", image: "" });
  const [newFinish, setNewFinish] = useState({ name: "", image: "" });
  const [newColor, setNewColor] = useState({ name: "", colorCode: "" });

  const [imageFile, setImageFile] = useState(null);  // For storing the selected file
  const [uploading, setUploading] = useState(false); // For upload state

  const [openDialog, setOpenDialog] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  // Function to check if a customization exists without updating the database
  const checkCustomizationExists = async (type, customization) => {
    try {
      const response = await axios.post("http://localhost:8070/api/customization/check-existence", {
        type,
        customization,
      });
      return response.data.exists;
    } catch (error) {
      console.error(`Error checking existence of ${type}:`, error);
      alert(`Error checking existence of ${type}.`);
      return false;
    }
  };

  // Function to handle the image upload
  const uploadImageToFirebase = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `customizations/${file.name}`);  // Create a reference
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploading(true);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optional: You can monitor the upload progress here if needed
        },
        (error) => {
          console.error("Image upload failed:", error);
          setUploading(false);
          reject(error);
        },
        () => {
          // On complete, get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploading(false);
            resolve(downloadURL);  // Return the download link
          });
        }
      );
    });
  };

  const handleAddCustomization = async (type, customization) => {
    const exists = await checkCustomizationExists(type, customization);

    if (exists) {
      // Show confirmation dialog if the customization exists
      setPendingUpdate({ type, customization });
      setOpenDialog(true);  // Open dialog
    } else {
      try {
        // Upload image to Firebase Storage first
        if (imageFile) {
          const imageUrl = await uploadImageToFirebase(imageFile);
          customization.image = imageUrl;  // Set the Firebase URL to the image field
        }

        // Proceed to add the customization if it does not exist
        const response = await axios.post("http://localhost:8070/api/customization/add-customization", {
          type,
          customization,
        });
        alert(response.data.message);  // Show success message
      } catch (error) {
        console.error(`Error adding ${type}:`, error);
        alert(`Failed to add ${type}.`);
      }
    }
  };

  const handleConfirmUpdate = async () => {
    if (pendingUpdate) {
      try {
        // Upload image to Firebase if there's a new image
        if (imageFile) {
          const imageUrl = await uploadImageToFirebase(imageFile);
          pendingUpdate.customization.image = imageUrl;  // Set the Firebase URL to the image field
        }

        const response = await axios.post("http://localhost:8070/api/customization/add-customization", {
          type: pendingUpdate.type,
          customization: pendingUpdate.customization,
        });
        alert(`${pendingUpdate.type.slice(0, -1)} updated successfully.`);
      } catch (error) {
        console.error(`Error updating ${pendingUpdate.type}:`, error);
        alert(`Failed to update ${pendingUpdate.type.slice(0, -1)}.`);
      }
    }
    setPendingUpdate(null);  // Reset pending update
    setOpenDialog(false);  // Close dialog
  };

  const handleCancelUpdate = () => {
    setPendingUpdate(null);  // Reset pending update
    setOpenDialog(false);  // Close dialog
    alert("No changes were made.");  // Notify the user
  };

  const handleAddMaterial = () => {
    handleAddCustomization("materials", newMaterial);
    setNewMaterial({ name: "", image: "" });
    setImageFile(null);  // Clear the selected image file
  };

  const handleAddFinish = () => {
    handleAddCustomization("finishes", newFinish);
    setNewFinish({ name: "", image: "" });
    setImageFile(null);  // Clear the selected image file
  };

  const handleAddColor = () => {
    handleAddCustomization("colors", newColor);
    setNewColor({ name: "", colorCode: "" });
    setImageFile(null);  // Clear the selected image file
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
        <FDM></FDM>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <SLA></SLA>
      </CustomTabPanel>
    </Box>


    </div>
  );
};

export default AdminCustomizationForm;
