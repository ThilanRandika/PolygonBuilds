import { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios'; // For making API requests

const SelectionOptions = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    material: '',
    finish: '',
    color: '',
  });

  const [materials, setMaterials] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [colors, setColors] = useState([]);

  const isSmallScreen = useMediaQuery('(max-width:380px)');

  // Fetch the customizations from the backend on component mount
  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        // Make a single API call to fetch all customizations (materials, finishes, colors)
        const response = await axios.get('http://localhost:8070/api/customization/all-customizations');

        // Update state with fetched data
        setMaterials(response.data.materials || []);
        setFinishes(response.data.finishes || []);
        setColors(response.data.colors || []);
      } catch (error) {
        console.error('Error fetching customizations:', error);
      }
    };

    fetchCustomizations();
  }, []);

  const handleOptionSelect = (category, option) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      // If the selected option is the same as the previous one, deselect it by setting it to an empty string
      [category]: prevState[category] === option ? '' : option,
    }));
  };

  const renderOption = (category, option) => (
    <Grid item xs={isSmallScreen ? 6 : 3} key={option.name}>
      <Card
        sx={{
          border: selectedOptions[category] === option.name ? '2px solid blue' : '2px solid transparent',
          transition: 'border-color 0.3s ease',
          width: isSmallScreen ? '70px' : '70px', // Adjust card width based on screen size
          height: isSmallScreen ? '90px' : '90px', // Adjust card height based on screen size
        }}
        onClick={() => handleOptionSelect(category, option.name)}
      >
        <CardActionArea>
          {category === 'color' ? (
            <div
              style={{
                height: '50px',
                backgroundColor: option.colorCode,
              }}
            />
          ) : (
            <CardMedia component="img" height="100" image={option.image} alt={option.name} />
          )}
          <CardContent>
            <Typography variant="body2" color="textSecondary" align="center">
              {option.name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '380px', margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Select Options
      </Typography>

      {/* Material Selection */}
      <Typography variant="h6" gutterBottom>
        Material
      </Typography>
      <Grid container spacing={2}>
        {materials.map((material) => renderOption('material', material))}
      </Grid>

      {/* Finish Selection */}
      <Typography variant="h6" gutterBottom style={{ marginTop: '20px', marginRight: '20px' }}>
        Finish
      </Typography>
      <Grid container spacing={2}>
        {finishes.map((finish) => renderOption('finish', finish))}
      </Grid>

      {/* Color Selection */}
      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
        Colors
      </Typography>
      <Grid container spacing={2}>
        {colors.map((color) => renderOption('color', color))}
      </Grid>
    </div>
  );
};

export default SelectionOptions;
