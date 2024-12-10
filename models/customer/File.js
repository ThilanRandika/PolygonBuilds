const mongoose = require('mongoose');

// Mongoose file schema
const fileSchema = new mongoose.Schema({
    email: { type: String, required: true },
    type: { type: String, required: true },
    fileURL: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  });
  
const File = mongoose.model('File', fileSchema);
module.exports = File;
