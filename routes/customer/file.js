const express = require('express');
const File = require('../../models/customer/File');
const router = express.Router();

router.post('/saveFile', async (req, res) => {
    const { email, type, fileUrl, imageUrl } = req.body;

    console.log('req.bpdy', req.body)
  
    if (!email || !type || !fileUrl || !imageUrl) {
      return res.status(400).json({ error: 'Invalid input' });
    }
  
    try {
      // Save the file URL with reference to the user's email
      const newFile = new File({ email, type, fileUrl, imageUrl });
      const savedFile = await newFile.save();
  
      return res.status(200).json({ 
        message: 'File saved successfully', 
        file: {
          id: savedFile._id, // Return the ObjectId
        },
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save the file' });
    }
  });

  
router.delete('/deleteFile/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'File ID is required' });
    }

    try {
        // Find the file by ID and delete it
        const deletedFile = await File.findByIdAndDelete(id);

        if (!deletedFile) {
        return res.status(404).json({ error: 'File not found' });
        }

        return res.status(200).json({ message: 'File deleted successfully'});
        
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete the file' });
    }
});
  

// Route to fetch models based on email
router.get('/models', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Find all files uploaded by the user with the given email
    const files = await File.find({ email });

    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'No models found for this user' });
    }

    return res.status(200).json({ models: files });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch models' });
  }
});

router.delete('/deleteAll', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'User email is required' });
    }

    const deletedFiles = await File.deleteMany({ email });
    return res.status(200).json({ message: 'All files deleted successfully', deletedFiles });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete files' });
  }
});



module.exports = router;
