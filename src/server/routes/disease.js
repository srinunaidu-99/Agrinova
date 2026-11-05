import express from "express";
import { Blob } from "buffer";
import multer from "multer";
import fs from "fs";
import path from "path";

import Crop from "../models/Crop.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// ========================================
// Upload directory
// ========================================

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "crops"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// ========================================
// Multer
// ========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const filename =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    cb(null, filename);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed."
        )
      );
    }

    cb(null, true);
  },
});

// ========================================
// REAL AI ANALYSIS
// ========================================

router.post(
  "/analyze",
  protect,
  upload.single("image"),

  async (req, res) => {
    try {
      console.log("\n========================================");
      console.log("🌱 CROP HEALTH ANALYSIS");
      console.log("========================================");

      console.log("Multer file:", req.file);
      console.log("Body:", req.body);

      // ------------------------------------
      // Check uploaded image
      // ------------------------------------

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Crop image is required.",
        });
      }

      // ------------------------------------
      // Check crop ID
      // ------------------------------------

      const cropId = req.body.cropId;

      if (!cropId) {
        return res.status(400).json({
          success: false,
          message: "Crop ID is required.",
        });
      }

      console.log("📷 File:", req.file.filename);
      console.log("🌱 Crop ID:", cropId);

      // ------------------------------------
      // Find user's crop
      // ------------------------------------

      const crop = await Crop.findOne({
        _id: cropId,
        user: req.user.userId,
      });

      if (!crop) {
        return res.status(404).json({
          success: false,
          message: "Crop not found.",
        });
      }

      // ------------------------------------
      // Read image
      // ------------------------------------

      const imagePath = req.file.path;

      const imageBuffer = fs.readFileSync(
        imagePath
      );

      console.log(
        "📦 Image size:",
        imageBuffer.length,
        "bytes"
      );

      // ====================================
      // SEND IMAGE TO PYTHON AI
      // ====================================

      console.log("📤 Preparing image for Python AI...");

      const formData = new FormData();

      const imageBlob = new Blob(
        [imageBuffer],
        {
          type: req.file.mimetype,
        }
      );

      formData.append(
        "image",
        imageBlob,
        req.file.originalname
      );

      console.log("🤖 Sending image to Python AI...");

      const aiResponse = await fetch(
        "http://127.0.0.1:5001/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log(
        "🤖 Python status:",
        aiResponse.status
      );

      const responseText =
        await aiResponse.text();

      console.log(
        "🤖 Python response:",
        responseText
      );

      // ------------------------------------
      // Parse AI response
      // ------------------------------------

      let aiData;

      try {
        aiData = JSON.parse(responseText);
      } catch (parseError) {
        console.error(
          "❌ Python returned invalid JSON"
        );

        return res.status(502).json({
          success: false,
          message:
            "Python AI returned an invalid response.",
          rawResponse: responseText,
        });
      }

      // ------------------------------------
      // AI failed
      // ------------------------------------

      if (
        !aiResponse.ok ||
        !aiData.success
      ) {
        console.error(
          "❌ AI analysis failed:",
          aiData
        );

        return res.status(502).json({
          success: false,
          message: "AI analysis failed.",
          ai: aiData,
        });
      }

      // ------------------------------------
      // Get prediction
      // ------------------------------------

      const prediction =
        aiData.prediction;

      if (!prediction) {
        return res.status(502).json({
          success: false,
          message:
            "Python AI response does not contain prediction.",
        });
      }

      console.log(
        "🌱 Disease:",
        prediction.disease
      );

      console.log(
        "📊 Confidence:",
        prediction.confidence
      );

      console.log(
        "❤️ Status:",
        prediction.status
      );

      // ====================================
      // SAVE REAL RESULT TO MONGODB
      // ====================================

      crop.healthStatus =
        prediction.status ||
        "Not Checked";

      crop.disease =
        prediction.disease || "";

      crop.confidence =
        typeof prediction.confidence ===
        "number"
          ? prediction.confidence
          : null;

      crop.healthImage =
        `/uploads/crops/${req.file.filename}`;

      crop.lastHealthCheck =
        new Date();

      await crop.save();

      console.log(
        "💾 Health result saved to MongoDB ✅"
      );

      // ====================================
      // FINAL RESPONSE
      // ====================================

      return res.status(200).json({
        success: true,

        message:
          "Crop health analyzed successfully.",

        analysis: {
          cropId: crop._id,

          cropName:
            crop.cropName,

          status:
            crop.healthStatus,

          disease:
            crop.disease,

          confidence:
            crop.confidence,

          healthy:
            prediction.healthy,

          image:
            crop.healthImage,

          lastChecked:
            crop.lastHealthCheck,

          topPredictions:
            prediction.topPredictions ||
            aiData.top_predictions ||
            [],
        },
      });

    } catch (error) {
      console.error(
        "❌ Crop health error:"
      );

      console.error(error);

      return res.status(500).json({
        success: false,

        message:
          "Crop health analysis failed.",

        error:
          error.message,
      });
    }
  }
);

// ========================================
// Uploaded image
// ========================================

router.get(
  "/image/:filename",
  protect,
  (req, res) => {
    const filePath = path.join(
      uploadDir,
      req.params.filename
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message:
          "Image not found.",
      });
    }

    res.sendFile(filePath);
  }
);

// ========================================
// Multer errors
// ========================================

router.use(
  (error, req, res, next) => {
    if (
      error instanceof
      multer.MulterError
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    next();
  }
);

export default router;