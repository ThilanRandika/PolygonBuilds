// models/FdmCustomization.js
const mongoose = require("mongoose");

const fdmCustomizationSchema = new mongoose.Schema({
  processes: [
    {
      name: { type: String, required: true },
    },
  ],
  materials: [
    {
      name: { type: String, required: true },
      image: { type: String},
    },
  ],
  finishes: [
    {
      name: { type: String, required: true },
      image: { type: String},
    },
  ],
  infills: [
    {
      name: { type: String, required: true },
    },
  ],
  colors: [
    {
      name: { type: String, required: true },
      colorCode: { type: String},
    },
  ],
  layerHeights: [
    {
      name: { type: String, required: true },
    },
  ]
});

const FdmCustomization = mongoose.model("FdmCustomization", fdmCustomizationSchema);
module.exports = FdmCustomization;
