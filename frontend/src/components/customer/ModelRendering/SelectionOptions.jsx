import { useState } from 'react';
import { Typography, Grid, Card, CardActionArea, CardContent, CardMedia } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const SelectionOptions = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    material: '',
    finish: '',
    color: '',
  });

  const isSmallScreen = useMediaQuery('(max-width:380px)');

  const materials = [
    { name: 'Nylon PA12', image: 'https://th.bing.com/th/id/OIP.p5Z6Yq0iRH-vppVYY92y6wHaFl?w=242&h=183&c=7&r=0&o=5&dpr=1.3&pid=1.7' },
    { name: 'Nylon PA11', image: 'https://th.bing.com/th/id/OIP.EL9hHs_Sp-lgbUEVkqOP4AHaE8?w=251&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7' },
    { name: 'TPU (flexible)', image: 'https://th.bing.com/th/id/OIP.waVIKBhNsz1vOzPuGYeFbwHaE8?w=244&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7' },
    { name: 'Polypropylene', image: 'https://th.bing.com/th/id/OIP.P6K8B_dviYx02-GMqSNuWwHaEo?w=274&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7' },
  ];

  const finishes = [
    { name: 'Raw (grey)', image: 'https://th.bing.com/th/id/OIP.EnzAZWujTUgS-2boVsCljQHaHa?pid=ImgDet&w=185&h=185&c=7&dpr=1.3' },
    { name: 'Raw Polished (grey)', image: 'https://thumbs.dreamstime.com/b/gold-texture-background-design-shiny-yellow-metal-foil-surface-material-137448112.jpg' },
    { name: 'Dyed with Color touch', image: 'https://th.bing.com/th/id/OIP.KjsYnY9jBcujqiGkrZtVwAAAAA?pid=ImgDet&w=185&h=102&c=7&dpr=1.3' },
    { name: 'Metal plating PVD', image: 'https://th.bing.com/th/id/OIP.e0PmVfzTBlMg1Txl92jabQHaE7?pid=ImgDet&w=185&h=123&c=7&dpr=1.3' },
  ];

  const colors = [
    { name: 'Gray', colorCode: '#808080' },
    { name: 'Black', colorCode: '#000000' },
  ];

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
