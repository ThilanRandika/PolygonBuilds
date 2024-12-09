const express = require('express');
const File = require('../../models/customer/File');
const router = express.Router();

router.post('/saveFile', async (req, res) => {
    const { email, type, fileURL } = req.body;
  
    if (!email || !type || !fileURL) {
      return res.status(400).json({ error: 'Invalid input' });
    }
  
    try {
      // Save the file URL with reference to the user's email
      const newFile = new File({ email, type, fileURL });
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
  



module.exports = router;
