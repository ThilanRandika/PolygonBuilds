import { useState } from 'react';
import { Box, Typography, Input, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase/firebaseConfig'; // Make sure this points to your Firebase config

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Handle file selection and trigger the confirmation popup
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setOpenDialog(true); // Open the confirmation dialog
  };

  // Handle file upload to Firebase Storage
  const handleUpload = () => {
    if (!selectedFile) return;

    const storageRef = ref(storage, `files/${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Optional: Handle file upload progress here
      },
      (error) => {
        console.error('Error uploading file:', error);
      },
      () => {
        // File upload completed, get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);

          // You can also send the download URL to your backend here if needed
        });
      }
    );
    setOpenDialog(false); // Close dialog after upload
  };

  // Handle user closing the dialog without uploading
  const handleCancel = () => {
    setSelectedFile(null); // Clear the selected file
    setOpenDialog(false); // Close the confirmation dialog
  };

  return (
    <>
      {/* The main upload component */}
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
              backgroundColor: '#e3f2fd68', // Light blue background on hover
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

          {/* Remove the IconButton and just display the icon without interactive behavior */}
          <Box component="span">
            <UploadFileIcon sx={{ color: '#b4b7ff', fontSize: '3.5rem' }} />
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            All uploads are secure and confidential.
          </Typography>
        </Box>
      </label>

      {/* Confirmation dialog for file upload */}
      <Dialog
        open={openDialog}
        onClose={handleCancel} // Close when clicking outside or pressing cancel
      >
        <DialogTitle>Upload Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have selected <strong>{selectedFile?.name}</strong> to upload. Do you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
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
