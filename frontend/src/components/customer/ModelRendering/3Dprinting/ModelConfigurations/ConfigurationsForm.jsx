import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  TextField,
  Box,
} from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Navigate, useNavigate } from "react-router-dom";
import ConfigurationsPreview from "./ConfigurationsPreview";
import { AuthContext } from "../../../../../context/AuthContext";

const ConfigurationsForm = ({ itemDetails, isEditMode, cartId, modelLink }) => {
  const {user} = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State to track overall loading
  const [process, setProcess] = useState("");
  const [customizations, setCustomizations] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [additionalFields, setAdditionalFields] = useState({
    quantity: 1,
    fileUnits: "",
    technicalDrawing: null,
    printOrientation: "",
    cosmeticSide: "",
    industryDescription: "",
    hardnessDescription: "",
    specialInstructions: "",
  });

  // Pre-fill form when itemDetails are available
  useEffect(() => {
    if (isEditMode) {
      // Pre-fill form when itemDetails are available
      if (itemDetails) {
        setProcess(itemDetails.process || ""); // Set process
        setSelectedOptions({
          material: itemDetails.material || "",
          color: itemDetails.color || "",
          finish: itemDetails.finish || "",
          infill: itemDetails.infill || "",
          layerHeight: itemDetails.layerHeight || "",
        });
        setAdditionalFields({
          quantity: itemDetails.quantity || 1,
          fileUnits: itemDetails.fileUnits || "",
          technicalDrawing: itemDetails.technicalDrawing || null,
          printOrientation: itemDetails.printOrientation || "",
          cosmeticSide: itemDetails.cosmeticSide || "",
          industryDescription: itemDetails.industryDescription || "",
          hardnessDescription: itemDetails.hardnessDescription || "",
          specialInstructions: itemDetails.specialInstructions || "",
        });
  
        // Fetch customizations based on the process in itemDetails
        if (itemDetails.process) {
          fetchCustomizations(itemDetails.process);
        }
      }
    } else {
      // Default process for new customization
      setProcess("FDM");
      fetchCustomizations("FDM");
    }
  }, [itemDetails, isEditMode]);
  
  

  // Handle process selection
  const handleProcessChange = (event, newProcess) => {
    if (newProcess) {
      setProcess(newProcess);
      fetchCustomizations(newProcess);
      setSelectedOptions({}); // Reset selections when process changes
    }
  };

  // Fetch customizations based on the selected process
  const fetchCustomizations = async (process) => {
    setLoading(true); // Start overall loading
    try {
      const endpoint =
        process === "FDM"
          ? "http://localhost:8070/api/customization/fdm/all-customizations"
          : "http://localhost:8070/api/customization/sla/all-customizations";
      const response = await axios.get(endpoint);
      setCustomizations(response.data);
    } catch (error) {
      console.error("Error fetching customizations:", error);
    } finally {
        setLoading(false); // Stop overall loading
    }
  };

  // Handle selection of options
  const handleOptionChange = (category, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  // Handle additional fields input
  const handleAdditionalFieldChange = (field, value) => {
    setAdditionalFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    setAdditionalFields((prev) => ({
      ...prev,
      technicalDrawing: event.target.files[0],
    }));
  };

  // Submit form
const handleSubmit = async () => {
  // Combine all fields into one flat object
  const submissionData = {
    user_id: user._id,
    model: modelLink,
    process,
    ...selectedOptions,
    ...additionalFields,
  };

  console.log('Submit', submissionData);

  try {
    if (isEditMode) {
      // Update existing cart item
      const response = await axios.put(
        `http://localhost:8070/api/cart/update/${cartId}`,
        submissionData
      );
      console.log("Update Response:", response.data);
      alert("Cart item updated successfully!");
    } else {
      // Add new cart item
      const response = await axios.post(
        "http://localhost:8070/api/cart/add",
        submissionData
      );
      console.log("Add Response:", response.data);
      alert("New item added to cart successfully!");
    }
    navigate("/cart"); // After the operation, navigate to the cart page
  } catch (error) {
    console.error("Error submitting data:", error);
    alert("An error occurred while submitting the customization.");
  }
};


  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px', // Space between columns
        height: '100vh',
      }} 
    >

      {/* Scrollable Section */}
      <Box
        sx={{
          overflowY: 'auto', // Enable vertical scrolling
          maxHeight: '100%', // Restrict height to container
          paddingRight: '8px', // Add padding for better scroll appearance
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Customize Your 3D Print
          </Typography>

          {/* Process Selection with Toggle Buttons */}
          <ToggleButtonGroup
            value={process}
            exclusive
            onChange={handleProcessChange}
            fullWidth
            style={{ marginBottom: "20px" }}
          >
            <ToggleButton value="FDM">FDM</ToggleButton>
            <ToggleButton value="SLA">SLA</ToggleButton>
          </ToggleButtonGroup>

          {process && (
            <Grid container spacing={2}>
              {/* File Units */}
              <Grid item xs={12} md={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>File Units</InputLabel>
                  <Select
                    value={additionalFields.fileUnits}
                    onChange={(e) => handleAdditionalFieldChange("fileUnits", e.target.value)}
                  >
                    <MenuItem value="mm">mm</MenuItem>
                    <MenuItem value="in">in</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Quantity */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Quantity</InputLabel>
                  <TextField
                    type="number"
                    value={additionalFields.quantity}
                    onChange={(e) => handleAdditionalFieldChange("quantity", e.target.value)}
                    inputProps={{ min: 1, max: 100 }}
                  />
                </FormControl>
              </Grid>

              {/* Existing Customizations */}
              {customizations.materials && (
                <Grid item xs={12} md={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Select Material</InputLabel>
                    <Select
                      value={selectedOptions.material || ""}
                      onChange={(e) => handleOptionChange("material", e.target.value)}
                    >
                      {customizations.materials.map((material, index) => (
                        <MenuItem key={index} value={material.name}>
                          {material.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {/* Finishes */}
              {customizations.finishes && (
                <Grid item xs={12} md={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Select Finish</InputLabel>
                    <Select
                      value={selectedOptions.finish || ""}
                      onChange={(e) =>
                        handleOptionChange("finish", e.target.value)
                      }
                    >
                      {customizations.finishes.map((finish, index) => (
                        <MenuItem key={index} value={finish.name}>
                          {finish.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {/* Infills (only for FDM) */}
              {process === "FDM" && customizations.infills && (
                <Grid item xs={12} md={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Select Infill</InputLabel>
                    <Select
                      value={selectedOptions.infill || ""}
                      onChange={(e) =>
                        handleOptionChange("infill", e.target.value)
                      }
                    >
                      {customizations.infills.map((infill, index) => (
                        <MenuItem key={index} value={infill.name}>
                          {infill.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {/* Colors */}
              {customizations.colors && (
                <Grid item xs={12} md={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Select Color</InputLabel>
                    <Select
                      value={selectedOptions.color || ""}
                      onChange={(e) =>
                        handleOptionChange("color", e.target.value)
                      }
                    >
                      {customizations.colors.map((color, index) => (
                        <MenuItem key={index} value={color.name}>
                          {color.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {/* Layer Heights */}
              {customizations.layerHeights && (
                <Grid item xs={12} md={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Select Layer Height</InputLabel>
                    <Select
                      value={selectedOptions.layerHeight || ""}
                      onChange={(e) =>
                        handleOptionChange("layerHeight", e.target.value)
                      }
                    >
                      {customizations.layerHeights.map((layerHeight, index) => (
                        <MenuItem key={index} value={layerHeight.name}>
                          {layerHeight.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}


              {/* Technical Drawing Upload */}
              <Grid item xs={12} md={12}>
                <FormControl fullWidth margin="normal">
                  <Typography>Upload Technical Drawing (Optional)</Typography>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png,.jpeg"
                    onChange={handleFileUpload}
                    style={{ marginTop: "8px" }}
                  />
                </FormControl>
              </Grid>

              {/* Additional Text Fields */}
              {[
                { name: "printOrientation", label: "Print Orientation" },
                { name: "cosmeticSide", label: "Cosmetic Side" },
                { name: "industryDescription", label: "Industry Description" },
                { name: "hardnessDescription", label: "Hardness Description" },
                { name: "specialInstructions", label: "Special Instructions" },
              ].map((field) => (
                <Grid item xs={12} key={field.name}>
                  <TextField
                    fullWidth
                    label={field.label}
                    value={additionalFields[field.name]}
                    onChange={(e) => handleAdditionalFieldChange(field.name, e.target.value)}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Submit Button */}
          {process && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              style={{ marginTop: "20px" }}
            >
              {isEditMode ? "Save Configurations" : "Add to Cart"}
            </Button>
          )}
        </Box>
      </Box>

      {/* Static Section */}
      <Box>
        <ConfigurationsPreview
          selectedOptions={selectedOptions}
          customizations={customizations}
          onOptionChange={handleOptionChange}
          loading={loading}
        />
      </Box>
      
    </Box>
  );
};

export default ConfigurationsForm;
