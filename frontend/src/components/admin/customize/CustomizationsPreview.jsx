import { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios'; // For making API requests

function CustomizationsPreview() {
  const [materials, setMaterials] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [colors, setColors] = useState([]);
  const isSmallScreen = useMediaQuery('(max-width:380px)');

  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        const response = await axios.get('http://localhost:8070/api/customization/all-customizations');
        setMaterials(response.data.materials || []);
        setFinishes(response.data.finishes || []);
        setColors(response.data.colors || []);
      } catch (error) {
        console.error('Error fetching customizations:', error);
      }
    };

    fetchCustomizations();
  }, []);

  const renderOption = (category, option) => (
    <Grid item xs={isSmallScreen ? 6 : 3} key={option.name}>
      <Card
        sx={{
          transition: 'border-color 0.3s ease',
          width: isSmallScreen ? '70px' : '70px',
          height: isSmallScreen ? '90px' : '90px',
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

      <Typography variant="h6" gutterBottom>
        Material
      </Typography>
      <Grid container spacing={2}>
        {materials.map((material) => renderOption('material', material))}
      </Grid>

      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
        Finish
      </Typography>
      <Grid container spacing={2}>
        {finishes.map((finish) => renderOption('finish', finish))}
      </Grid>

      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
        Colors
      </Typography>
      <Grid container spacing={2}>
        {colors.map((color) => renderOption('color', color))}
      </Grid>
    </div>
  )
}

export default CustomizationsPreview