import { useState } from 'react';
import { Box, Typography, Input, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase/firebaseConfig'; // Ensure your Firebase config is set up
import { useNavigate } from 'react-router-dom'; // If using React Router

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate(); // To navigate to the STL viewer page

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setOpenDialog(true);
  };

  // Handle file upload
  const handleUpload = () => {
    if (!selectedFile) return;

    const storageRef = ref(storage, `files/${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Optional: You can add a progress bar here
      },
      (error) => {
        console.error('Error uploading file:', error);
      },
      () => {
        // File uploaded successfully, get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);

          // Store the download URL in localStorage (or state management like Redux)
          localStorage.setItem('uploadedFileURL', downloadURL);

          // Redirect to the STL viewer page
          navigate('/createOrder');
        });
      }
    );
    setOpenDialog(false);
  };

  return (
    <>
      {/* Main upload component */}
      <label htmlFor="upload-button" style={{ cursor: 'pointer' }}>
        <Box
          sx={{
            border: '3px dashed #b0c4de',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            width: '600px',
            textAlign: 'center',
            margin: 'auto',
            mt: 5,
            '&:hover': {
              backgroundColor: '#e3f2fd68',
            },
          }}
        >
          <Typography variant="h6">Get instant pricing, project lead times, and DFM feedback.</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Supported formats: STL
          </Typography>

          <Input
            inputProps={{ accept: '.stl' }}
            id="upload-button"
            type="file"
            onChange={handleFileChange}
            sx={{ display: 'none' }}
          />
          <Box component="span">
            <UploadFileIcon sx={{ color: '#b4b7ff', fontSize: '3.5rem' }} />
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            All uploads are secure and confidential.
          </Typography>
        </Box>
      </label>

      {/* Confirmation dialog for file upload */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Upload Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have selected <strong>{selectedFile?.name}</strong> to upload. Do you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary" autoFocus>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FileUpload;
