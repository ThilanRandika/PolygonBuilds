import { Box, Typography, Button } from "@mui/material";

const ConfigurationHeader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
        backgroundColor: "#f5f5f5", // Adjust to your needs
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* Left Section */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <img
          src="/path/to/icon.png" // Replace with your icon path or logo
          alt="icon"
          style={{ width: "40px", height: "40px", marginRight: "16px" }}
        />
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", color: "#555" }}
          >
            Quote Q59-4054-0502 / Configure Part
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#000" }}
          >
            FreeCad_10-Body.step
          </Typography>
        </Box>
      </Box>

      {/* Right Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

        {/* Upload Drawings */}
        <Button
          variant="text"
          sx={{
            color: "#007BFF",
            textTransform: "none",
          }}
        >
          Upload Drawings
        </Button>

        {/* Cancel Button */}
        <Button
          variant="outlined"
          sx={{
            color: "#555",
            borderColor: "#ddd",
            textTransform: "none",
          }}
        >
          Cancel
        </Button>

        {/* Save Properties Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#007BFF",
            color: "#fff",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#0056b3",
            },
          }}
        >
          Save Properties
        </Button>
      </Box>
    </Box>
  );
};

export default ConfigurationHeader;
