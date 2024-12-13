// models/FdmCustomization.js
const mongoose = require("mongoose");

const slaCustomizationSchema = new mongoose.Schema({
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
  // infills: [
  //   {
  //     name: { type: String, required: true },
  //   },
  // ],
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

const SlaCustomization = mongoose.model("SlaCustomization", slaCustomizationSchema);
module.exports = SlaCustomization;
