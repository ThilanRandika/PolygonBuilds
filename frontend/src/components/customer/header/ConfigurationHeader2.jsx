import { Box, Button } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt"; // Configure icon
import SearchIcon from "@mui/icons-material/Search"; // Analyze icon
import { useNavigate, useLocation } from "react-router-dom"; // Import hooks for navigation and location

const ConfigurationHeader2 = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const location = useLocation(); // Hook to get the current path

  // Helper function to determine if a tab is active
  const isActive = (path) => location.pathname === path;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center", // Center items vertically
        justifyContent: "center", // Space between logo and buttons
        height: "64px", // Set consistent height for the header
        padding: "0 16px", // Horizontal padding
        backgroundColor: "#fff", // White background
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* Right Section (Buttons) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center", // Ensures buttons are vertically centered
          gap: 2, // Adds consistent spacing between buttons
        }}
      >
        {/* Configure Button */}
        <Button
          startIcon={<FilterAltIcon />}
          variant={isActive("/3dmodel/configurations") ? "contained" : "text"} // Highlight active tab
          onClick={() => navigate("/3dmodel/configurations")} // Navigate to Create Order page
          sx={{
            backgroundColor: isActive("/3dmodel/configurations") ? "#D0E9FF" : "transparent", // Light blue background if active
            color: isActive("/3dmodel/configurations") ? "#007BFF" : "#007BFF",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#D0E9FF", // Hover effect
            },
          }}
        >
          Configure
        </Button>

        {/* Analyze Button */}
        <Button
          startIcon={<SearchIcon />}
          variant={isActive("/3dmodel/stl-Advance-viewer") ? "contained" : "text"} // Highlight active tab
          onClick={() => navigate("/3dmodel/stl-Advance-viewer")} // Navigate to Advanced Model Viewer page
          sx={{
            backgroundColor: isActive("/3dmodel/stl-Advance-viewer") ? "#D0E9FF" : "transparent", // Light blue background if active
            color: isActive("/3dmodel/stl-Advance-viewer") ? "#007BFF" : "#007BFF",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#D0E9FF", // Hover effect
            },
          }}
        >
          Analyze
        </Button>
      </Box>
    </Box>
  );
};

export default ConfigurationHeader2;
