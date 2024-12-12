import { useContext, useState } from 'react';
import {
  Box,
  Typography,
  Input,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ModelContext } from '../../../context/ModelContext';
import axios from 'axios';
import ProgressDialog from './popups/ProgressDialog';
import ExplanationDialog from './popups/ExplanationDialog';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { setModelLink } = useContext(ModelContext);
  const { setFileId } = useContext(ModelContext);
  

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
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);
  
          // Save the file to the backend using axios
          const response = await axios.post('http://localhost:8070/api/file/saveFile', {
            email, // Assuming email is set in your component
            type: '3Dprinting', // Adjust based on file type
            fileURL: downloadURL,
          });
  
          if (response.status === 200) {
            console.log('File saved successfully:', response.data);
            // Optionally, use response.data.file.id or other data from the response
            setModelLink(downloadURL); // Update context with the file link
            setFileId(response.data.file.id);
            navigate('/3dmodel/stl-Advance-viewer');
          } else {
            console.error('Failed to save file:', response.data.error);
          }
        } catch (error) {
          console.error('Error during saveFile request:', error.response?.data || error.message);
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
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
      <ExplanationDialog
        open={openDialog}
        setOpenDialog={setOpenDialog}
        isEmailMode={isEmailMode}
        setIsEmailMode={setIsEmailMode}
        email={email}
        setEmail={setEmail}
        emailError={emailError}
        handleEmailChange={handleEmailChange}
        handleUpload={handleUpload}
      />

      {/* Progress Dialog */}
      <ProgressDialog open={isUploading} uploadProgress={uploadProgress} />
    </>
  );
};

export default FileUpload;
