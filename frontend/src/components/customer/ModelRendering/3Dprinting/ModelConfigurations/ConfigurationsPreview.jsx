import React from "react";
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button } from "@mui/material";

const ConfigurationsPreview = ({ selectedOptions, customizations, onOptionChange }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Preview Your Selections
      </Typography>

      <Grid container spacing={2}>
        {/* Materials */}
        {customizations.materials && (
          <Grid item xs={12}>
            <Typography variant="h6">Material</Typography>
            <Grid container spacing={2}>
              {customizations.materials.map((material) => (
                <Grid item xs={3} key={material._id}>
                  <Card
                    onClick={() => onOptionChange("material", material.name)}
                    variant={selectedOptions.material === material.name ? "outlined" : "elevation"}
                    sx={{
                      height: 100,
                      width: 100,
                      cursor: "pointer",
                      border: selectedOptions.material === material.name ? "2px solid #1976d2" : "none",
                    }}
                  >
                    {material.image && (
                      <CardMedia component="img" image={material.image} height="100" alt={material.name} />
                    )}
                    <CardContent>
                      <Typography>{material.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        {/* Finishes */}
        {customizations.finishes && (
          <Grid item xs={12}>
            <Typography variant="h6">Finish</Typography>
            <Grid container spacing={2}>
              {customizations.finishes.map((finish) => (
                <Grid item xs={3} key={finish._id}>
                  <Card
                    onClick={() => onOptionChange("finish", finish.name)}
                    variant={selectedOptions.finish === finish.name ? "outlined" : "elevation"}
                    sx={{
                      height: 100,
                      width: 100,
                      cursor: "pointer",
                      border: selectedOptions.finish === finish.name ? "2px solid #1976d2" : "none",
                    }}
                  >
                    {finish.image && (
                      <CardMedia component="img" image={finish.image} height="100" alt={finish.name} />
                    )}
                    <CardContent>
                      <Typography>{finish.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}

        {/* Colors */}
        {customizations.colors && (
          <Grid item xs={12}>
            <Typography variant="h6">Color</Typography>
            <Grid container spacing={2}>
              {customizations.colors.map((color) => (
                <Grid item xs={4} key={color._id}>
                  <Button
                    onClick={() => onOptionChange("color", color.name)}
                    variant="contained"
                    sx={{
                      width: "100%",
                      height: "50px",
                      backgroundColor: color.colorCode,
                      border: selectedOptions.color === color.name ? "2px solid #1976d2" : "none",
                      color: "#fff",
                    }}
                  >
                    {color.name}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ConfigurationsPreview;
