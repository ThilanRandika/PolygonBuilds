// models/Customization.js
const mongoose = require("mongoose");

const customizationSchema = new mongoose.Schema({
  materials: [
    {
      name: { type: String, required: true },
      image: { type: String, required: true },
    },
  ],
  finishes: [
    {
      name: { type: String, required: true },
      image: { type: String, required: true },
    },
  ],
  colors: [
    {
      name: { type: String, required: true },
      colorCode: { type: String, required: true },
    },
  ],
});

const Customization = mongoose.model("Customization", customizationSchema);
module.exports = Customization;
