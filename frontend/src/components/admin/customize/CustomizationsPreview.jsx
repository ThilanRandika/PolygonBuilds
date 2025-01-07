import { useState, useEffect } from "react";
import { Typography, Grid, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";

function CustomizationsPreview({ selectedProcess, refreshPreview }) {
  const [customizations, setCustomizations] = useState({ materials: [], finishes: [], colors: [] });
  const [loading, setLoading] = useState(false); // State to track overall loading
  const [imageLoading, setImageLoading] = useState({}); // State to track individual image loading
  const isSmallScreen = useMediaQuery("(max-width:380px)");

  // Fetch customizations based on the selected process type
  useEffect(() => {
    const fetchCustomizations = async () => {
      setLoading(true); // Start overall loading
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/customization/${selectedProcess.toLowerCase()}/all-customizations`
        );
        setCustomizations(response.data);

        // Initialize image loading states for all items
        const initialLoadingState = {};
        ["materials", "finishes", "colors"].forEach((category) => {
          response.data[category].forEach((item) => {
            initialLoadingState[item.name] = true; // Set all images as loading initially
          });
        });
        setImageLoading(initialLoadingState);
      } catch (error) {
        console.error("Error fetching customizations:", error);
      } finally {
        setLoading(false); // Stop overall loading
      }
    };

    fetchCustomizations();
  }, [selectedProcess, refreshPreview]); // Refetch when process type or refresh state changes

  const handleImageLoad = (name) => {
    setImageLoading((prev) => ({ ...prev, [name]: false })); // Set specific image as loaded
  };

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
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {category === "colors" ? (
              <div
                style={{
                  height: "50px",
                  backgroundColor: option.colorCode,
                  width: "100%",
                }}
              />
            ) : (
              <>
                {imageLoading[option.name] && ( // Show spinner while image is loading
                  <CircularProgress
                    size={24}
                    sx={{ position: "absolute", zIndex: 1 }}
                  />
                )}
                <CardMedia
                  component="img"
                  height="50"
                  image={option.image}
                  alt={option.name}
                  onLoad={() => handleImageLoad(option.name)} // Mark image as loaded
                  style={{
                    display: imageLoading[option.name] ? "none" : "block", // Hide image until loaded
                  }}
                />
              </>
            )}
          </Box>
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

      {loading ? ( // Show overall loading spinner if data is still being fetched
        <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh", // Adjust height as needed
                      }}
                    >
                      <CircularProgress size={80} /> {/* Increase the size here */}
                    </Box>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default CustomizationsPreview;
