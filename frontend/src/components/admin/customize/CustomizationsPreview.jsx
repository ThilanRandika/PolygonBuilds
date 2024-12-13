import { useState, useEffect } from "react";
import { Typography, Grid, Card, CardActionArea, CardContent, CardMedia } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";

function CustomizationsPreview({ selectedProcess, refreshPreview }) {
  const [customizations, setCustomizations] = useState({ materials: [], finishes: [], colors: [] });
  const isSmallScreen = useMediaQuery("(max-width:380px)");

  // Fetch customizations based on the selected process type
  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8070/api/customization/${selectedProcess.toLowerCase()}/all-customizations`
        );
        setCustomizations(response.data);
      } catch (error) {
        console.error("Error fetching customizations:", error);
      }
    };

    fetchCustomizations();
  }, [selectedProcess, refreshPreview]); // Refetch when process type or refresh state changes

  const renderOption = (category, option) => (
    <Grid item xs={isSmallScreen ? 6 : 3} key={option.name}>
      <Card
        sx={{
          transition: "border-color 0.3s ease",
          width: isSmallScreen ? "70px" : "70px",
          height: isSmallScreen ? "90px" : "90px",
        }}
      >
        <CardActionArea>
          {category === "colors" ? (
            <div
              style={{
                height: "50px",
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
    <div style={{ padding: "20px", maxWidth: "380px", margin: "0 auto" }}>
      <Typography variant="h4" style={{ textAlign: "center", marginBottom: "10px" }}>
        Preview
      </Typography>

      <Typography variant="h6" gutterBottom>
        Materials
      </Typography>
      <Grid container spacing={2}>
        {customizations.materials.map((material) => renderOption("materials", material))}
      </Grid>

      <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
        Finishes
      </Typography>
      <Grid container spacing={2}>
        {customizations.finishes.map((finish) => renderOption("finishes", finish))}
      </Grid>

      <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
        Colors
      </Typography>
      <Grid container spacing={2}>
        {customizations.colors.map((color) => renderOption("colors", color))}
      </Grid>
    </div>
  );
}

export default CustomizationsPreview;
