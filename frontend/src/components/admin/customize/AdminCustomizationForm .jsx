import React, { useState } from "react";
import { TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import axios from "axios";

const AdminCustomizationForm = () => {
  const [materials, setMaterials] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [colors, setColors] = useState([]);

  const [newMaterial, setNewMaterial] = useState({ name: "", image: "" });
  const [newFinish, setNewFinish] = useState({ name: "", image: "" });
  const [newColor, setNewColor] = useState({ name: "", colorCode: "" });

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

  const handleAddCustomization = async (type, customization) => {
    const exists = await checkCustomizationExists(type, customization);

    if (exists) {
      // Show confirmation dialog if the customization exists
      setPendingUpdate({ type, customization });
      setOpenDialog(true);  // Open dialog
    } else {
      // Proceed to add the customization if it does not exist
      try {
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
  };

  const handleAddFinish = () => {
    handleAddCustomization("finishes", newFinish);
    setNewFinish({ name: "", image: "" });
  };

  const handleAddColor = () => {
    handleAddCustomization("colors", newColor);
    setNewColor({ name: "", colorCode: "" });
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Customize Selection Options</Typography>
      
      {/* Form for Adding New Material */}
      <Typography variant="h6" gutterBottom>Add New Material</Typography>
      <TextField
        label="Material Name"
        fullWidth
        value={newMaterial.name}
        onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
      />
      <TextField
        label="Image URL"
        fullWidth
        value={newMaterial.image}
        onChange={(e) => setNewMaterial({ ...newMaterial, image: e.target.value })}
      />
      <Button onClick={handleAddMaterial}>Add Material</Button>

      {/* Form for Adding New Finish */}
      <Typography variant="h6" gutterBottom>Add New Finish</Typography>
      <TextField
        label="Finish Name"
        fullWidth
        value={newFinish.name}
        onChange={(e) => setNewFinish({ ...newFinish, name: e.target.value })}
      />
      <TextField
        label="Image URL"
        fullWidth
        value={newFinish.image}
        onChange={(e) => setNewFinish({ ...newFinish, image: e.target.value })}
      />
      <Button onClick={handleAddFinish}>Add Finish</Button>

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
      <Button onClick={handleAddColor}>Add Color</Button>

      {/* Dialog to confirm update */}
      <Dialog open={openDialog} onClose={handleCancelUpdate}>
        <DialogTitle>Update Existing Customization</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This customization already exists. Do you want to update it with the new information?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpdate} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminCustomizationForm;
