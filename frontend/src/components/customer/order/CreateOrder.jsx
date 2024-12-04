import { useEffect, useState } from "react";
import Header from "../header/Header";
import ModelPropertiesForm from "../ModelRendering/ModelPropertiesForm";
import SelectionOptions from "../ModelRendering/SelectionOptions";
import STLViewer from "../ModelRendering/STLViewer";
import { Box } from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function CreateOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState({
    material: '',
    finish: '',
    color: '',
  });
  const [modelLink, setModelLink] = useState(''); // Store the model link here
  const [isEditMode, setIsEditMode] = useState(false);
  const [itemDetails, setItemDetails] = useState(null); // Set to null initially
  const [cartId, setCartId] = useState(null); // Set to null initially

  // Fetch item details when itemId is available
  useEffect(() => {
    if (location.state?.itemId) {
      const { itemId } = location.state;
      setIsEditMode(true);
      setCartId(itemId);
      fetchCartItem(itemId);
    }
  }, [location.state]);

  const fetchCartItem = async (itemId) => {
    try {
      console.log("Fetching item with ID: ", itemId);
      const response = await axios.get(`http://localhost:8070/api/cart/cartItem/${itemId}`);
      setItemDetails(response.data);
      setModelLink(response.data.model); // Set model link after item details are fetched
    } catch (error) {
      console.error("Error fetching cart item:", error);
    }
  };

  // Log itemDetails and modelLink once they have been updated
  useEffect(() => {
    if (itemDetails) {
      console.log("Fetched itemDetails:", itemDetails);
      console.log("Fetched modelLink:", modelLink);
    }
  }, [itemDetails, modelLink]);


  // Function to update selected options
  const handleOptionSelect = (category, option) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [category]: option,
    }));
  };

  return (
    <>
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr', // Middle column is twice as large
          gap: '16px', // Space between columns
          padding: '16px', 
          height: '100vh' // Takes the full height of the viewport
        }}
      >
        {/* Left Column - STLViewer (Fixed) */}
        <Box 
          sx={{
            backgroundColor: '#f0f0f0', 
            padding: '16px', 
            borderRadius: '8px', 
            position: 'sticky', 
            top: 0, // Keeps the component fixed at the top
            height: '100vh', // Full viewport height to stay fixed
            overflow: 'auto' // Enable scroll if content exceeds height
          }}
        >
          <STLViewer setModelLink={setModelLink} /> {/* Pass setModelLink to STLViewer */}
        </Box>

        {/* Middle Column - ModelPropertiesForm (Scrollable) */}
        <Box 
          sx={{
            backgroundColor: '#ffffff', 
            padding: '16px', 
            borderRadius: '8px', 
            overflowY: 'auto', // Enable vertical scroll for the middle section
            maxHeight: '100vh' // Restrict height to viewport height
          }}
        >
          {/* Pass selected options as props */}
          <ModelPropertiesForm
          selectedOptions={selectedOptions}
          handleOptionSelect={handleOptionSelect}
          modelLink={modelLink}
          itemDetails={itemDetails}
          isEditMode={isEditMode} // Pass the isEditMode state to ModelPropertiesForm
          cartId={cartId}
        />

        </Box>

        {/* Right Column - SelectionOptions (Fixed) */}
        <Box 
          sx={{
            backgroundColor: '#f0f0f0', 
            padding: '16px', 
            borderRadius: '8px', 
            position: 'sticky', 
            top: 0, // Keeps the component fixed at the top
            height: '100vh', // Full viewport height to stay fixed
            overflow: 'auto' // Enable scroll if content exceeds height
          }}
        >
          {/* Pass the handler and selected options as props */}
          <SelectionOptions
            selectedOptions={selectedOptions}
            handleOptionSelect={handleOptionSelect}
          />
        </Box>
      </Box>
    </>
  );
}

export default CreateOrder;
