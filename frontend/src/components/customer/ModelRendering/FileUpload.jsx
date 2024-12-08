import React, { useState } from 'react';
import {
  Box,
  Typography,
  Input,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
  TextField,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setOpenDialog(true);
    }
  };

  // Handle email input validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)); // Basic email validation
  };

  // Handle file upload
  const handleUpload = () => {
    if (!selectedFile) return;

    const storageRef = ref(storage, `files/${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    setIsUploading(true);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Error uploading file:', error);
        setIsUploading(false);
        setUploadProgress(0);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          localStorage.setItem('uploadedFileURL', downloadURL);
          setIsUploading(false);
          setUploadProgress(0);
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
          <Typography variant="h6">
            Get instant pricing, project lead times, and DFM feedback.
          </Typography>
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

      {/* Explanation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          Privacy Guarantee
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {!isEmailMode ? (
            <>
            {/* Dialog Content */}
            <DialogContent
              sx={{
                width: '900px', // Set a custom increased width
                maxWidth: '100%', // Prevent it from breaking the viewport boundaries on smaller devices
                textAlign: 'left',
                mx: 'auto',
                p: 3,
                overflow: 'hidden', // Prevent scrollbars
              }}
            >
              {/* Description with bold highlights */}
              <DialogContentText
                sx={{
                  fontSize: '1rem',
                  color: '#4a4a4a',
                  mb: 3,
                }}
              >
                We guarantee that your uploaded files will remain private. For added security, you can{' '}
                <Typography
                  component="span"
                  sx={{ fontWeight: 'bold', display: 'inline' }}
                >
                  log in
                </Typography>{' '}
                or{' '}
                <Typography
                  component="span"
                  sx={{ fontWeight: 'bold', display: 'inline' }}
                >
                  proceed with an email address
                </Typography>{' '}
                for communication.
              </DialogContentText>
          
              {/* Dialog Actions */}
              <DialogActions
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                }}
              >
                {/* Log In Button */}
                <Button
                  onClick={() => {
                    setOpenDialog(false);
                    navigate('/login');
                  }}
                  color="primary"
                  variant="contained"
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    height: '48px',
                    backgroundColor: '#3b82f6',
                    '&:hover': {
                      backgroundColor: '#2563eb',
                    },
                    borderRadius: '0px',
                  }}
                >
                  Log In
                </Button>
          
                {/* Proceed with Email Button */}
                <Button
                  onClick={() => setIsEmailMode(true)}
                  color="primary"
                  variant="outlined"
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    height: '48px',
                    color: '#2563eb',
                    borderColor: '#2563eb',
                    '&:hover': {
                      backgroundColor: '#eff6ff',
                    },
                    borderRadius: '0px',
                  }}
                >
                  Proceed with Email
                </Button>
              </DialogActions>
            </DialogContent>
          </>
          
          
          
          ) : (
            <>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 1,
              }}
            >
              Welcome to Poligonbuilds Network
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                color: '#6b7280',
                mb: 3,
              }}
            >
              To view your quote, please enter your email address or{' '}
              <Typography
                component="span"
                sx={{
                  color: '#2563eb',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setOpenDialog(false);
                  navigate('/login');
                }}
              >
                sign in
              </Typography>
              .
            </Typography>
            <TextField
              fullWidth
              placeholder="Your work email *"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              error={emailError}
              helperText={emailError ? 'Please enter a valid email address' : ''}
              InputProps={{
                style: {
                  borderRadius: '8px',
                  height: '48px',
                },
              }}
              sx={{
                mb: 3,
              }}
            />
            <Button
              fullWidth
              onClick={handleUpload}
              color="primary"
              variant="contained"
              disabled={!email || emailError}
              sx={{
                textTransform: 'none',
                height: '48px',
                backgroundColor: '#c7d2fe',
                color: '#374151',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#a5b4fc',
                },
              }}
            >
              Go to your quote
            </Button>
          </>

          )}
        </DialogContent>
      </Dialog>

      {/* Progress Dialog */}
      <Dialog
        open={isUploading}
        aria-labelledby="upload-progress-dialog"
        PaperProps={{
          sx: {
            padding: 2,
            borderRadius: 3,
            width: '400px',
            textAlign: 'center',
          },
        }}
      >
        <DialogTitle id="upload-progress-dialog" sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#4a4a4a' }}>
          Uploading File
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #6a11cb, #2575fc)',
                },
              }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontWeight: 'bold', color: '#4a4a4a' }}>
              {`${uploadProgress}% Completed`}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileUpload;
