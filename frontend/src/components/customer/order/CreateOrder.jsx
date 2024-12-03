import { useState } from "react";
import Header from "../header/Header";
import ModelPropertiesForm from "../ModelRendering/ModelPropertiesForm";
import SelectionOptions from "../ModelRendering/SelectionOptions";
import STLViewer from "../ModelRendering/STLViewer";
import { Box } from '@mui/material';

function CreateOrder() {
  // State to hold selected options
  const [selectedOptions, setSelectedOptions] = useState({
    material: '',
    finish: '',
    color: '',
  });
  const [modelLink, setModelLink] = useState(''); // New state for STL model URL

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
            modelLink={modelLink} // Pass model link to form
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
