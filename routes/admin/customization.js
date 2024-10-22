const express = require("express");
const router = express.Router();
const Customization = require("../../models/admin/Customization");

// Route to check if a specific customization exists
router.post("/check-existence", async (req, res) => {
  const { type, customization } = req.body;
  const { name } = customization;

  try {
    // Check if the customization exists in the database
    const existingCustomization = await Customization.findOne({ [`${type}.name`]: name });
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
router.post("/add-customization", async (req, res) => {
  const { type, customization } = req.body;
  const { name } = customization;

  try {
    const existingCustomization = await Customization.findOne({ [`${type}.name`]: name });

    if (existingCustomization) {
      const updatedCustomization = await Customization.findOneAndUpdate(
        { [`${type}.name`]: name },
        { $set: { [`${type}.$`]: customization } },
        { new: true }
      );
      return res.status(200).json({ message: `${type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)} updated successfully`, isUpdate: true, updatedCustomization });
    } else {
      const newCustomization = await Customization.findOneAndUpdate(
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

module.exports = router;
