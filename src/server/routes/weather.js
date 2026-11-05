import express from "express";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const location = req.query.location;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location is required",
      });
    }

    // Location → Latitude / Longitude
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        location
      )}&count=1&language=en&format=json`
    );

    if (!geoResponse.ok) {
      throw new Error("Geocoding API failed");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    const place = geoData.results[0];

    // Real Weather API
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
        `&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum` +
        `&forecast_days=7&timezone=auto`
    );

    if (!weatherResponse.ok) {
      throw new Error("Weather API failed");
    }

    const weatherData = await weatherResponse.json();

    res.json({
      success: true,

      location: {
        name: place.name,
        state: place.admin1,
        country: place.country,
        latitude: place.latitude,
        longitude: place.longitude,
      },

      current: weatherData.current,

      daily: weatherData.daily,

      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Weather Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch real weather data",
      error: error.message,
    });
  }
});

export default router;