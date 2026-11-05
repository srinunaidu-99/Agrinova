import express from "express";
import mongoose from "mongoose";
import Crop from "../models/Crop.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// ==================== IN-MEMORY FALLBACK CROPS ====================
let inMemoryCrops = [
  {
    _id: "crop-101",
    cropName: "Bt Cotton (Hybrid)",
    acreage: 6.5,
    sowingDate: "2024-06-15",
    soilType: "Black Cotton",
    irrigationType: "Drip Irrigation",
    status: "Flowering",
    healthStatus: "Healthy",
    confidence: 97.4,
    lastHealthCheck: new Date(Date.now() - 3600000 * 4).toISOString(),
    disease: "Optimal Foliage Health"
  },
  {
    _id: "crop-102",
    cropName: "Guntur Teja Chili",
    acreage: 4.0,
    sowingDate: "2024-07-02",
    soilType: "Red Sandy Loam",
    irrigationType: "Drip Irrigation",
    status: "Growing",
    healthStatus: "Disease Detected",
    confidence: 89.2,
    lastHealthCheck: new Date(Date.now() - 3600000 * 18).toISOString(),
    disease: "Early Cercospora Leaf Spot"
  }
];

// ==================== ADD CROP ====================
router.post("/", protect, async (req, res) => {
  try {
    const {
      cropName,
      acreage,
      sowingDate,
      soilType,
      irrigationType,
      status,
    } = req.body;

    if (
      !cropName ||
      acreage === undefined ||
      !sowingDate ||
      !soilType ||
      !irrigationType
    ) {
      return res.status(400).json({
        success: false,
        message: "All crop details are required",
      });
    }

    let crop = null;

    if (mongoose.connection.readyState === 1) {
      try {
        crop = await Crop.create({
          user: req.user.userId,
          cropName,
          acreage,
          sowingDate,
          soilType,
          irrigationType,
          status: status || "Growing",
        });
      } catch (err) {
        console.warn("DB save crop error, using memory store:", err.message);
      }
    }

    if (!crop) {
      crop = {
        _id: "crop-" + Date.now(),
        user: req.user.userId,
        cropName,
        acreage: Number(acreage),
        sowingDate,
        soilType,
        irrigationType,
        status: status || "Growing",
        healthStatus: "Not Checked",
        createdAt: new Date().toISOString()
      };
      inMemoryCrops.unshift(crop);
    }

    res.status(201).json({
      success: true,
      message: "Crop added successfully",
      crop,
    });
  } catch (error) {
    console.error("Add Crop Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error while adding crop",
    });
  }
});

// ==================== GET ALL MY CROPS ====================
router.get("/", protect, async (req, res) => {
  try {
    let crops = [];

    if (mongoose.connection.readyState === 1) {
      try {
        crops = await Crop.find({
          user: req.user.userId,
        }).sort({ createdAt: -1 });
      } catch (err) {
        console.warn("DB get crops error, using fallback crops:", err.message);
      }
    }

    if (crops.length === 0) {
      crops = inMemoryCrops;
    }

    res.json({
      success: true,
      count: crops.length,
      crops,
    });
  } catch (error) {
    console.error("Get Crops Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error while fetching crops",
    });
  }
});

// ==================== GET SINGLE CROP ====================
router.get("/:id", protect, async (req, res) => {
  try {
    const crop = await Crop.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    res.json({
      success: true,
      crop,
    });
  } catch (error) {
    console.error("Get Crop Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching crop",
    });
  }
});

// ==================== UPDATE CROP ====================
router.put("/:id", protect, async (req, res) => {
  try {
    const crop = await Crop.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    res.json({
      success: true,
      message: "Crop updated successfully",
      crop,
    });
  } catch (error) {
    console.error("Update Crop Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating crop",
    });
  }
});

// ==================== DELETE CROP ====================
router.delete("/:id", protect, async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    res.json({
      success: true,
      message: "Crop deleted successfully",
    });
  } catch (error) {
    console.error("Delete Crop Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting crop",
    });
  }
});

export default router;