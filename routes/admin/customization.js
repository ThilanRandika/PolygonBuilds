const express = require("express");
const router = express.Router();
const FdmCustomization = require("../../models/FdmCustomization");
const SlaCustomization = require("../../models/SlaCustomization");




//FDM

// Route to check if a specific customization exists
router.post("/fdm/check-existence", async (req, res) => {
  const { type, customization } = req.body;
  const { name } = customization;

  try {
    // Check if the customization exists in the database
    const existingCustomization = await FdmCustomization.findOne({ [`${type}.name`]: name });
    if (existingCustomization) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error checking customization existence", error });
  }
});

// Existing route for adding/updating customization
router.post("/fdm/add-customization", async (req, res) => {
  const { type, customization } = req.body;
  const { name } = customization;

  try {
    const existingCustomization = await FdmCustomization.findOne({ [`${type}.name`]: name });

    if (existingCustomization) {
      const updatedCustomization = await FdmCustomization.findOneAndUpdate(
        { [`${type}.name`]: name },
        { $set: { [`${type}.$`]: customization } },
        { new: true }
      );
      return res.status(200).json({ message: `${type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)} updated successfully`, isUpdate: true, updatedCustomization });
    } else {
      const newCustomization = await FdmCustomization.findOneAndUpdate(
        {},
        { $push: { [type]: customization } },
        { new: true, upsert: true }
      );
      return res.status(201).json({ message: `${type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)} added successfully`, isUpdate: false, newCustomization });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error updating customization", error });
  }
});


// API to get all customizations (materials, finishes, and colors)
router.get("/fdm/all-customizations", async (req, res) => {
  try {
    const customization = await FdmCustomization.findOne({});
    if (!customization) {
      return res.status(404).json({ message: "No customizations found" });
    }
    res.status(200).json({
      processes: customization.processes,
      materials: customization.materials,
      finishes: customization.finishes,
      colors: customization.colors,
      layerHeights: customization.layerHeights,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching customizations", error });
  }
});












//SLA

// Route to check if a specific customization exists
router.post("/sla/check-existence", async (req, res) => {
  const { type, customization } = req.body;
  const { name } = customization;

  try {
    // Check if the customization exists in the database
    const existingCustomization = await SlaCustomization.findOne({ [`${type}.name`]: name });
    if (existingCustomization) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error checking customization existence", error });
  }
});

// Existing route for adding/updating customization
router.post("/sla/add-customization", async (req, res) => {
  const { type, customization } = req.body;
  const { name } = customization;

  try {
    const existingCustomization = await SlaCustomization.findOne({ [`${type}.name`]: name });

    if (existingCustomization) {
      const updatedCustomization = await SlaCustomization.findOneAndUpdate(
        { [`${type}.name`]: name },
        { $set: { [`${type}.$`]: customization } },
        { new: true }
      );
      return res.status(200).json({ message: `${type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)} updated successfully`, isUpdate: true, updatedCustomization });
    } else {
      const newCustomization = await SlaCustomization.findOneAndUpdate(
        {},
        { $push: { [type]: customization } },
        { new: true, upsert: true }
      );
      return res.status(201).json({ message: `${type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)} added successfully`, isUpdate: false, newCustomization });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error updating customization", error });
  }
});


// API to get all customizations (processes, materials, finishes, infills, colors, and layerHeights)
router.get("/sla/all-customizations", async (req, res) => {
  try {
    const customization = await SlaCustomization.findOne({});
    if (!customization) {
      return res.status(404).json({ message: "No customizations found" });
    }
    res.status(200).json({
      processes: customization.processes,
      materials: customization.materials,
      finishes: customization.finishes,
      infills: customization.infills,
      colors: customization.colors,
      layerHeights: customization.layerHeights,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching customizations", error });
  }
});





module.exports = router;
