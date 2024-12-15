import { useContext, useState } from 'react';
import {
  Box,
  Typography,
  Input,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { ref, uploadBytesResumable, getDownloadURL, uploadString } from 'firebase/storage';
import { storage } from '../../../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ModelContext } from '../../../context/ModelContext';
import axios from 'axios';
import ProgressDialog from './popups/ProgressDialog';
import ExplanationDialog from './popups/ExplanationDialog';
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { setModelLink, modelLink } = useContext(ModelContext);
  const { setFileId } = useContext(ModelContext);
  

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'model/stl/STL' && !file.name.endsWith('.stl') && !file.name.endsWith('.STL') ) {
        alert('Please upload a valid STL file');
        return;
      }
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


  const getImageUrl = async (fileUrl) => {
    const loader = new STLLoader();
    try {
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const geometry = loader.parse(arrayBuffer);
      if (geometry && geometry.attributes) {
        const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const mesh = new THREE.Mesh(geometry, material);
        const bbox = new THREE.Box3().setFromObject(mesh);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        mesh.position.sub(center);
  
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        scene.add(mesh);
  
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(0, -120, 0);
        camera.lookAt(0, 0, 0);
  
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(100, 100);
  
        const canvas = renderer.domElement;
        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 0, 70);
  
        scene.add(ambientLight, directionalLight);
        renderer.render(scene, camera);
  
        const imgUrl = canvas.toDataURL('image/png');
        return await uploadToFirebase(imgUrl);
      } else {
        throw new Error('Invalid geometry');
      }
    } catch (error) {
      console.error('Error generating image URL:', error);
      throw error;
    }
  };
  


  const uploadToFirebase = async (dataUrl) => {
    const storageRef = ref(storage, `images/${Date.now()}.png`); // Unique path for the image
    
    try {
      // Upload the image as a base64 string
      await uploadString(storageRef, dataUrl, "data_url");
      console.log("Image uploaded to Firebase Storage.");
      
      // Get the download URL
      const downloadUrl = await getDownloadURL(storageRef);
      console.log("Download URL:", downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading to Firebase Storage:", error);
      throw error;
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return;
  
    console.log('File upload begins');
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
          setModelLink(downloadURL);

          
          // Wait for the image URL generation
          const generatedImageUrl = await getImageUrl(downloadURL);
          console.log('Generated Image URL:', generatedImageUrl);
  
          // Save the file to MongoDB
          const response = await axios.post('http://localhost:8070/api/file/saveFile', {
            email,
            type: '3Dprinting',
            fileUrl: downloadURL,
            imageUrl: generatedImageUrl,
          });
  
          if (response.status === 200) {
            console.log('File saved successfully:', response.data);
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
