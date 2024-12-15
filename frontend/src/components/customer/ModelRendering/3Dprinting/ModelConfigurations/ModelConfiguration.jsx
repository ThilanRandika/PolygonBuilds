import { useContext, useEffect, useState } from "react";
import STLViewer from "../modelAnalysis/STLViewer";
import { Box } from '@mui/material';
import { useLocation } from "react-router-dom";
import axios from "axios";
import ConfigurationHeader from "../../../header/ConfigurationHeader";
import { ModelContext } from "../../../../../context/ModelContext";
import ConfigurationsForm from "./ConfigurationsForm";

function ModelConfiguration() {
  const location = useLocation();
  const [selectedOptions, setSelectedOptions] = useState({
    material: '',
    finish: '',
    color: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [itemDetails, setItemDetails] = useState(null); // Set to null initially
  const [cartId, setCartId] = useState(null); // Set to null initially
  const { setModelLink, modelLink } = useContext(ModelContext);

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

  console.log("Is edit mode" ,isEditMode);
  console.log("cart id" ,cartId);

  return (
    <>
      <ConfigurationHeader cartId={cartId}/>
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 3fr',
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
          <STLViewer /> {/* Pass setModelLink to STLViewer */}
        </Box>

        {/* Right Column - ConfigurationsForm and preview */}
        <Box
          sx={{
            backgroundColor: 'ffffff',
            padding: '26px',
          }}
        >
            <ConfigurationsForm 
              itemDetails = {itemDetails}
              modelLink={modelLink}
              cartId={cartId}
              isEditMode={isEditMode}
            />
          </Box>
      </Box>




        {/* Middle Column - ModelPropertiesForm (Scrollable) */}
        {/* <Box 
          sx={{
            backgroundColor: '#ffffff', 
            padding: '16px', 
            borderRadius: '8px', 
            overflowY: 'auto', // Enable vertical scroll for the middle section
            maxHeight: '100vh' // Restrict height to viewport height
          }}
        >
          <ModelPropertiesForm
            selectedOptions={selectedOptions}
            handleOptionSelect={handleOptionSelect}
            modelLink={modelLink}
            itemDetails={itemDetails}
            isEditMode={isEditMode} // Pass the isEditMode state to ModelPropertiesForm
            cartId={cartId}
          />
        </Box> */}



        {/* Right Column - SelectionOptions (Fixed) */}
        {/* <Box 
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
          <SelectionOptions
            selectedOptions={selectedOptions}
            handleOptionSelect={handleOptionSelect}
          />
        </Box> */}


    </>
  );
}

export default ModelConfiguration;
