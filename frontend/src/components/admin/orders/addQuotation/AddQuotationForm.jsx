import React, { useState } from 'react';
import { Box, Button, Typography, TextField, LinearProgress } from '@mui/material';
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function AddQuotationForm({ orderId }) {
  const [file, setFile] = useState(null); // State for the uploaded file
  const [specialNotes, setSpecialNotes] = useState(''); // Optional notes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // State for upload progress

  const storage = getStorage(); // Firebase storage instance

  // Handle file change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadProgress(0); // Reset progress when a new file is selected
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please upload a file.');
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Step 1: Upload file to Firebase Storage
      const storageRef = ref(storage, `quotations/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Update progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Error uploading file:', error);
          setMessage('Failed to upload the file.');
          setIsSubmitting(false);
        },
        async () => {
          // Step 2: Get the file's download URL after upload
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Step 3: Send the quotation details to the backend
          const payload = {
            fileUrl: downloadURL,
            specialNotes,
          };

          try {
            const response = await axios.post(
              `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/adminOrder/addQuotation/${orderId}`,
              payload
            );
            setMessage('Quotation submitted successfully!');
            console.log('Response:', response.data);

            // Reset progress and file selection after successful submission
            setUploadProgress(0);
            setFile(null);
            setSpecialNotes('');
          } catch (error) {
            console.error('Error submitting quotation:', error);
            setMessage('Failed to submit the quotation.');
          } finally {
            setIsSubmitting(false);
          }
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      setMessage('An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upload Quotation
      </Typography>

      {/* File Upload */}
      <Button variant="contained" component="label" sx={{ mb: 2 }}>
        Upload File
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          hidden
          onChange={handleFileChange}
        />
      </Button>
      {file && <Typography>Selected File: {file.name}</Typography>}

      {/* Progress Bar */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Box sx={{ width: '100%', my: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
            Uploading: {Math.round(uploadProgress)}%
          </Typography>
        </Box>
      )}

      {/* Special Notes */}
      <TextField
        label="Special Notes (optional)"
        fullWidth
        multiline
        rows={4}
        value={specialNotes}
        onChange={(e) => setSpecialNotes(e.target.value)}
        sx={{ my: 2 }}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Quotation'}
      </Button>

      {/* Feedback Message */}
      {message && (
        <Typography
          variant="body2"
          color={message.includes('successfully') ? 'green' : 'error'}
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default AddQuotationForm;
