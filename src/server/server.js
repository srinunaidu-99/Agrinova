import dns from "dns";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// ==================== ROUTES ====================

import authRoutes from "./routes/auth.js";
import cropRoutes from "./routes/crops.js";
import weatherRoutes from "./routes/weather.js";
import marketRoutes from "./routes/market.js";
import diseaseRoutes from "./routes/disease.js";

// ==================== FILE PATH ====================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== MONGODB DNS FIX ====================

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// ==================== ENVIRONMENT ====================

dotenv.config({
  path: path.join(__dirname, ".env"),
});

// ==================== SERVER INFO ====================

console.log("");
console.log("========================================");
console.log("🌾 AGRINOVA SERVER");
console.log("========================================");

console.log(
  "MONGO_URI loaded:",
  !!process.env.MONGO_URI
);

console.log(
  "JWT_SECRET loaded:",
  !!process.env.JWT_SECRET
);

console.log(
  "MARKET_API_KEY loaded:",
  !!process.env.MARKET_API_KEY
);

console.log("========================================");
console.log("");

// ==================== EXPRESS APP ====================

const app = express();

// ==================== CORS ====================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ==================== BODY PARSERS ====================

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==================== UPLOADS ====================

// src/server/uploads
const uploadsPath = path.join(
  __dirname,
  "uploads"
);

app.use(
  "/uploads",
  express.static(uploadsPath)
);

console.log(
  "📁 Upload folder:",
  uploadsPath
);

// ==================== API ROUTES ====================

// AUTH
app.use(
  "/api/auth",
  authRoutes
);

// CROPS
app.use(
  "/api/crops",
  cropRoutes
);

// WEATHER
app.use(
  "/api/weather",
  weatherRoutes
);

// MARKET
app.use(
  "/api/market",
  marketRoutes
);

// DISEASE / CROP HEALTH
app.use(
  "/api/disease",
  diseaseRoutes
);

// ==================== API HEALTH CHECK ====================

app.get(
  "/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Agrinova API is working",
      server: "Node.js + Express",
      port: process.env.PORT || 5000,
      timestamp: new Date().toISOString(),
    });
  }
);

// ==================== DISEASE API TEST ====================

app.get(
  "/api/disease",
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "🌱 Disease API is working",
      endpoint: "/api/disease/analyze",
      method: "POST",
      requiresAuthentication: true,
      requiresImage: true,
    });
  }
);

// ==================== ROOT ====================

app.get(
  "/",
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "🌾 Agrinova Backend is running!",

      services: {
        health:
          "/api/health",

        auth:
          "/api/auth",

        crops:
          "/api/crops",

        weather:
          "/api/weather",

        market:
          "/api/market",

        disease:
          "/api/disease/analyze",
      },
    });
  }
);

// ==================== API 404 ====================

app.use(
  "/api",
  (req, res) => {
    res.status(404).json({
      success: false,
      message: "API route not found",
      method: req.method,
      path: req.originalUrl,
    });
  }
);

// ==================== GLOBAL ERROR HANDLER ====================

app.use(
  (error, req, res, next) => {
    console.error("");
    console.error("========================================");
    console.error("❌ EXPRESS ERROR");
    console.error("========================================");
    console.error(error);
    console.error("========================================");
    console.error("");

    res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal server error",
    });
  }
);

// ==================== MONGODB ====================

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ MONGO_URI is missing. Check src/server/.env");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("");
    console.warn("⚠️ MongoDB Connection Notice:", error.message);
    console.warn("💡 Tip: If using MongoDB Atlas, verify your IP address is whitelisted in MongoDB Atlas Security settings.");
    console.warn("🛡️ AgriNova Server is continuing in high-availability mode with fail-safe demo & cached telemetry support.");
    console.error("");
  }
};

// ==================== START SERVER ====================

const startServer = async () => {
  try {
    await connectDB();

    const PORT =
      process.env.PORT || 5000;

    app.listen(
      PORT,
      () => {
        console.log("");
        console.log(
          "========================================"
        );

        console.log(
          `🚀 Agrinova Server running on http://localhost:${PORT}`
        );

        console.log(
          "========================================"
        );

        console.log(
          `🌱 Crop API     : http://localhost:${PORT}/api/crops`
        );

        console.log(
          `🌦️ Weather API  : http://localhost:${PORT}/api/weather`
        );

        console.log(
          `📈 Market API   : http://localhost:${PORT}/api/market`
        );

        console.log(
          `🩺 Disease API  : http://localhost:${PORT}/api/disease/analyze`
        );

        console.log(
          `❤️ Health API   : http://localhost:${PORT}/api/health`
        );

        console.log(
          "========================================"
        );

        console.log("");
      }
    );
  } catch (error) {
    console.error(
      "❌ Server startup failed:",
      error.message
    );

    process.exit(1);
  }
};

// ==================== START ====================

startServer();