import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // If using React Router
import axios from "axios";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  TextareaAutosize,
  Box,
} from "@mui/material";
import { Navigate } from "react-router-dom";

const ModelPropertiesForm = ({ selectedOptions, handleOptionSelect, modelLink, itemDetails, isEditMode }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    quantity: "",
    material: "",
    finish: "",
    color: "",
    specialInstructions: "",
    verticalResolutionVisible: false,
    verticalResolution: "",
    verticalResolutionLetTeamDecide: false,
    infilTypeVisible: false,
    infilType: "",
    infilTypeLetTeamDecide: false,
  });

  const [materials, setMaterials] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        const response = await axios.get('http://localhost:8070/api/customization/all-customizations');
        setMaterials(response.data.materials || []);
        setFinishes(response.data.finishes || []);
        setColors(response.data.colors || []);
      } catch (error) {
        console.error('Error fetching customizations:', error);
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    };
  
    fetchCustomizations();
  }, []);

  useEffect(() => {
    if (isEditMode && itemDetails && Object.keys(itemDetails).length > 0) {
      setFormData({
        quantity: itemDetails.quantity || "",
        material: itemDetails.material || "",
        finish: itemDetails.finish || "",
        color: itemDetails.color || "",
        specialInstructions: itemDetails.specialInstructions || "",
        verticalResolution: itemDetails.verticalResolution || "",
        verticalResolutionLetTeamDecide: itemDetails.verticalResolutionLetTeamDecide || false,
        infilType: itemDetails.infilType || "",
        infilTypeLetTeamDecide: itemDetails.infilTypeLetTeamDecide || false,
      });
    }
  }, [isEditMode, itemDetails]);

  // Update formData whenever selectedOptions change (only if not in edit mode)
  useEffect(() => {
    if (!isEditMode) {
      setFormData((prevState) => ({
        ...prevState,
        material: selectedOptions.material,
        finish: selectedOptions.finish,
        color: selectedOptions.color,
      }));
    }
  }, [selectedOptions, isEditMode]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "material" || name === "finish" || name === "color") {
      handleOptionSelect(name, value);  // Sync with SelectionOptions
    }

  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the order data with the actual STL model link
    const orderData = {
      user_id: "user_id_placeholder", // Replace with actual user ID
      model: modelLink,  // Use the passed modelLink from STLViewer
      quantity: formData.quantity,
      material: formData.material,
      color: formData.color,
      quality: formData.finish,
      specialInstructions: formData.specialInstructions,
      // If the checkbox is checked, send "Let our team decide" instead of the selected value
    verticalResolution: formData.verticalResolutionLetTeamDecide
    ? "Let our team decide"
    : formData.verticalResolution,

  infilType: formData.infilTypeLetTeamDecide
    ? "Let our team decide"
    : formData.infilType,
    };

    try {
      const response = await axios.post("http://localhost:8070/api/cart/add", orderData);
      console.log("Order created:", response.data);
      navigate("/cart");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };


  if (isLoading) return <p>Loading...</p>;


  return (
    <div style={{ padding: "20px" }}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Part Properties
        </Typography>

        {/* Quantity */}
        <TextField
          label="Quantity"
          variant="outlined"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        {/* Material */}
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Material</InputLabel>
          <Select
            name="material"
            value={formData.material || ""}
            onChange={handleInputChange}
          >
            {materials.length > 0 ? (
              materials.map((material, index) => (
                <MenuItem key={index} value={material.name}>
                  {material.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No materials available</MenuItem>
            )}
          </Select>
        </FormControl>

        {/* Color */}
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Color</InputLabel>
          <Select
            name="color"
            value={formData.color}
            onChange={handleInputChange}
          >
            {colors.length > 0 ? (
              colors.map((color, index) => (
                <MenuItem key={index} value={color.name}>
                  {color.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No colors available</MenuItem>
            )}
          </Select>
        </FormControl>

        {/* Finish */}
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Finish</InputLabel>
          <Select
            name="finish"
            value={formData.finish}
            onChange={handleInputChange}
          >
            {finishes.length > 0 ? (
              finishes.map((finish, index) => (
                <MenuItem key={index} value={finish.name}>
                  {finish.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No finishes available</MenuItem>
            )}
          </Select>
        </FormControl>

        
        {/* Vertical Resolution */}
        <FormControl component="fieldset" fullWidth>
          <Typography mt={2}>Vertical Resolution</Typography>

          <Box display="flex" flexDirection="column">
            {/* Vertical Resolution Select */}
            <FormControl variant="outlined" fullWidth margin="normal">
              <Select
                displayEmpty
                name="verticalResolution"
                value={formData.verticalResolution}
                onChange={handleInputChange}
                renderValue={(selected) =>
                  selected ? selected : "Select Vertical Resolution"
                }
                disabled={formData.verticalResolutionLetTeamDecide}
              >
                <MenuItem value="0.1mm">0.1mm</MenuItem>
                <MenuItem value="0.2mm">0.2mm</MenuItem>
              </Select>
            </FormControl>

            {/* Let Team Decide Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  name="verticalResolutionLetTeamDecide"
                  checked={formData.verticalResolutionLetTeamDecide}
                  onChange={(e) => {
                    handleCheckboxChange(e);
                    if (e.target.checked) {
                      // Clear selected vertical resolution if checkbox is checked
                      handleInputChange({
                        target: { name: "verticalResolution", value: "" },
                      });
                    }
                  }}
                />
              }
              label="Let our team decide for you"
            />
          </Box>
        </FormControl>

        {/* Infill Type */}
        <FormControl component="fieldset" fullWidth>
          <Typography mt={2}>Infill Type</Typography>

          <Box display="flex" flexDirection="column">
            {/* Infill Type Select */}
            <FormControl variant="outlined" fullWidth margin="normal">
              <Select
                displayEmpty
                name="infilType"
                value={formData.infilType}
                onChange={handleInputChange}
                renderValue={(selected) =>
                  selected ? selected : "Select Infill Type"
                }
                disabled={formData.infilTypeLetTeamDecide}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>

            {/* Let Team Decide Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  name="infilTypeLetTeamDecide"
                  checked={formData.infilTypeLetTeamDecide}
                  onChange={(e) => {
                    handleCheckboxChange(e);
                    if (e.target.checked) {
                      // Clear selected infil type if checkbox is checked
                      handleInputChange({
                        target: { name: "infilType", value: "" },
                      });
                    }
                  }}
                />
              }
              label="Let our team decide for you"
            />
          </Box>
        </FormControl>

        {/* Special Instructions */}
        <FormControl component="fieldset" fullWidth>
          <Typography mt={2} variant="h6" gutterBottom>
            Special Instructions
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Please provide any additional notes or instructions that you would like
            our team to consider while processing your order. This could include
            specific handling requests, color preferences, or other details.
          </Typography>
          <TextareaAutosize
            minRows={4}
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleInputChange}
            placeholder="Enter any special instructions..."
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "10px",
              fontSize: "16px",
            }}
          />
        </FormControl>

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginTop: "20px" }}
        >
          {isEditMode ? "Save Configurations" : "Add to Cart"}
        </Button>
      </form>
    </div>
  );
};

export default ModelPropertiesForm;
