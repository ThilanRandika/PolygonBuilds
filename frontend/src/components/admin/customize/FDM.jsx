import { Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../../firebase/firebaseConfig';

function FDM({ onCustomizationChange }) {
  const [process, setProcess] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [finish, setFinish] = useState([]);
  const [layerHeight, setLayerHeight] = useState([]);
  const [color, setColor] = useState([]);
  const [infill, setInfill] = useState([]);

  const [newProcess, setNewProcess] = useState({ name: ""});
  const [newMaterial, setNewMaterial] = useState({ name: "", image: "" });
  const [newFinish, setNewFinish] = useState({ name: "", image: "" });
  const [newLayerHeight, setNewLayerHeight] = useState({ name: ""});
  const [newColor, setNewColor] = useState({ name: "", colorCode: "" });
  const [newInfill, setNewInfill] = useState({ name: ""});

  const [imageFile, setImageFile] = useState(null);  // For storing the selected file
  const [uploading, setUploading] = useState(false); // For upload state

  const [openDialog, setOpenDialog] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  // Function to check if a customization exists without updating the database
  const checkCustomizationExists = async (type, customization) => {
    try {
      const response = await axios.post("http://localhost:8070/api/customization/fdm/check-existence", {
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
        const response = await axios.post("http://localhost:8070/api/customization/fdm/add-customization", {
          type,
          customization,
        });
        alert(response.data.message);  // Show success message
        onCustomizationChange(); // Notify parent about the change
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

        const response = await axios.post("http://localhost:8070/api/customization/fdm/add-customization", {
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

  const handleAddProcess = () => {
    handleAddCustomization("processes", newProcess);
    setNewProcess({ name: "" });
    setImageFile(null);  // Clear the selected image file
  };

  const handleAddLayerHeight = () => {
    handleAddCustomization("layerHeights", newLayerHeight);
    setNewLayerHeight({ name: "" });
    setImageFile(null);  // Clear the selected image file
  };

  const handleAddInfill = () => {
    handleAddCustomization("infills", newInfill);
    setNewInfill({ name: "" });
    setImageFile(null);  // Clear the selected image file
  };






  return (
    <div>
      FDM
      {/* Form for Adding New Process */}
      <Typography variant="h6" gutterBottom>Add New Process</Typography>
      <TextField
        label="Process Name"
        fullWidth
        value={newProcess.name}
        onChange={(e) => setNewProcess({...newProcess, name: e.target.value })}
        />
        <Button onClick={handleAddProcess} disabled={uploading}>Add Process</Button>

      {/* Form for Adding New Material */}
      <Typography variant="h6" gutterBottom>Add New Material</Typography>
      <TextField
        label="Material Name"
        fullWidth
        value={newMaterial.name}
        onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}  // Select the file
      />
      <Button onClick={handleAddMaterial} disabled={uploading}>Add Material</Button>

      {/* Form for Adding New Finish */}
      <Typography variant="h6" gutterBottom>Add New Finish</Typography>
      <TextField
        label="Finish Name"
        fullWidth
        value={newFinish.name}
        onChange={(e) => setNewFinish({ ...newFinish, name: e.target.value })}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}  // Select the file
      />
      <Button onClick={handleAddFinish} disabled={uploading}>Add Finish</Button>

      {/* Form for Adding New Color */}
      <Typography variant="h6" gutterBottom>Add New Color</Typography>
      <TextField
        label="Color Name"
        fullWidth
        value={newColor.name}
        onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
      />
      <TextField
        label="Color Code"
        fullWidth
        value={newColor.colorCode}
        onChange={(e) => setNewColor({ ...newColor, colorCode: e.target.value })}
      />
      <Button onClick={handleAddColor} disabled={uploading}>Add Color</Button>

      {/* Form for Adding New Layer Height */}
      <Typography variant="h6" gutterBottom>Add New Layer Height</Typography>
      <TextField
        label="Layer Height (mm)"
        fullWidth
        value={newLayerHeight.name}
        onChange={(e) => setNewLayerHeight({...newLayerHeight, name: e.target.value })}
      />
      <Button onClick={handleAddLayerHeight} disabled={uploading}>Add Layer Height</Button>

      {/* Form for Adding New Infill */}
      <Typography variant="h6" gutterBottom>Add New Infill</Typography>
      <TextField
        label="Infill (%)"
        fullWidth
        value={newInfill.name}
        onChange={(e) => setNewInfill({...newInfill, name: e.target.value })}
      />
      <Button onClick={handleAddInfill} disabled={uploading}>Add Infill</Button>

    </div>
  )
}

export default FDM