import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cropName: {
      type: String,
      required: true,
      trim: true,
    },

    acreage: {
      type: Number,
      required: true,
      min: 0,
    },

    sowingDate: {
      type: Date,
      required: true,
    },

    soilType: {
      type: String,
      required: true,
      trim: true,
    },

    irrigationType: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Growing", "Harvested", "Planned"],
      default: "Growing",
    },

    // =========================
    // 🌱 REAL AI CROP HEALTH
    // =========================

    healthStatus: {
      type: String,
      enum: ["Not Checked", "Healthy", "Disease Detected"],
      default: "Not Checked",
    },

    disease: {
      type: String,
      default: "",
    },

    confidence: {
      type: Number,
      default: null,
    },

    healthImage: {
      type: String,
      default: "",
    },

    lastHealthCheck: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Crop = mongoose.model("Crop", cropSchema);

export default Crop;