import express from "express";
import protect from "../middleware/auth.js";

const router = express.Router();

const MARKET_API_URL =
  process.env.MARKET_API_URL ||
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

// ======================================================
// COMMODITY ALIAS
// ======================================================

const normalizeCommodity = (value = "") => {
  const name = value.trim().toLowerCase();

  const aliases = {
    tamota: "Tomato",
    tomato: "Tomato",
    tomatoes: "Tomato",

    ullipaya: "Onion",
    onion: "Onion",

    bangaladumpa: "Potato",
    potato: "Potato",

    vari: "Paddy",
    paddy: "Paddy",
    rice: "Paddy",

    mokkajonna: "Maize",
    maize: "Maize",
    corn: "Maize",

    mirchi: "Chilli",
    chilli: "Chilli",
    chili: "Chilli",

    cotton: "Cotton",
    pratti: "Cotton",

    wheat: "Wheat",

    groundnut: "Groundnut",
    peanut: "Groundnut",
  };

  return aliases[name] || value.trim();
};

// ======================================================
// CATEGORY
// ======================================================

const getCategory = (commodity = "") => {
  const name = commodity.toLowerCase().trim();

  const vegetables = [
    "onion",
    "potato",
    "tomato",
    "brinjal",
    "cabbage",
    "cauliflower",
    "carrot",
    "radish",
    "beans",
    "lady finger",
    "okra",
    "green chilli",
    "capsicum",
    "peas",
    "bottle gourd",
    "bitter gourd",
    "ridge gourd",
    "pumpkin",
    "cucumber",
  ];

  const fruits = [
    "apple",
    "banana",
    "mango",
    "orange",
    "grapes",
    "papaya",
    "guava",
    "water melon",
    "watermelon",
    "pomegranate",
    "pineapple",
    "sapota",
    "muskmelon",
  ];

  const cereals = [
    "rice",
    "paddy",
    "wheat",
    "maize",
    "jowar",
    "bajra",
    "ragi",
    "barley",
    "millet",
  ];

  const pulses = [
    "gram",
    "chana",
    "tur",
    "arhar",
    "moong",
    "urad",
    "masoor",
    "lentil",
    "rajma",
  ];

  const spices = [
    "chilli",
    "red chilli",
    "turmeric",
    "cumin",
    "jeera",
    "coriander",
    "pepper",
    "ginger",
    "garlic",
    "cardamom",
    "cloves",
  ];

  const oilSeeds = [
    "groundnut",
    "peanut",
    "soyabean",
    "soybean",
    "sunflower",
    "sesamum",
    "sesame",
    "mustard",
    "linseed",
    "castor",
    "safflower",
  ];

  const commercialCrops = [
    "cotton",
    "sugarcane",
    "jute",
    "tobacco",
    "tea",
    "coffee",
    "rubber",
  ];

  if (vegetables.some((item) => name.includes(item))) {
    return "Vegetables";
  }

  if (fruits.some((item) => name.includes(item))) {
    return "Fruits";
  }

  if (cereals.some((item) => name.includes(item))) {
    return "Cereals";
  }

  if (pulses.some((item) => name.includes(item))) {
    return "Pulses";
  }

  if (spices.some((item) => name.includes(item))) {
    return "Spices";
  }

  if (oilSeeds.some((item) => name.includes(item))) {
    return "Oil Seeds";
  }

  if (commercialCrops.some((item) => name.includes(item))) {
    return "Commercial Crops";
  }

  return "Other";
};

// ======================================================
// NUMBER CONVERTER
// ======================================================

const toNumber = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const cleaned = String(value)
    .replace(/,/g, "")
    .trim();

  const number = Number(cleaned);

  return Number.isFinite(number) ? number : null;
};

// ======================================================
// DATE PARSER
// ======================================================

const parseDate = (dateString) => {
  if (!dateString) return 0;

  const value = String(dateString).trim();

  // DD/MM/YYYY
  if (value.includes("/")) {
    const parts = value.split("/");

    if (parts.length === 3) {
      const day = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const year = Number(parts[2]);

      return new Date(
        year,
        month,
        day
      ).getTime();
    }
  }

  // DD-MM-YYYY
  if (value.includes("-")) {
    const parts = value.split("-");

    if (
      parts.length === 3 &&
      parts[0].length <= 2
    ) {
      const day = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const year = Number(parts[2]);

      return new Date(
        year,
        month,
        day
      ).getTime();
    }
  }

  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
};

// ======================================================
// MARKET API
// ======================================================

router.get("/", protect, async (req, res) => {
  try {
    let {
      state = "",
      district = "",
      market = "",
      commodity = "",
      category = "",
    } = req.query;

    state = state.trim();
    district = district.trim();
    market = market.trim();
    category = category.trim();

    // Convert user input to Government commodity name
    const normalizedCommodity =
      normalizeCommodity(commodity);

    console.log("");
    console.log("========================================");
    console.log("🌾 AGRINOVA REAL MARKET API");
    console.log("========================================");

    console.log(
      "State:",
      state || "ALL"
    );

    console.log(
      "District:",
      district || "ALL"
    );

    console.log(
      "Market:",
      market || "ALL"
    );

    console.log(
      "Commodity:",
      commodity || "ALL"
    );

    console.log(
      "Normalized Commodity:",
      normalizedCommodity || "ALL"
    );

    console.log(
      "Category:",
      category || "ALL"
    );

    console.log(
      "User:",
      req.user?.userId
    );

    // ==================================================
    // API KEY CHECK
    // ==================================================

    const apiKey =
      process.env.MARKET_API_KEY;

    if (!apiKey) {
      console.error(
        "❌ MARKET_API_KEY is missing"
      );

      return res.status(500).json({
        success: false,
        source:
          "AGMARKNET / Government OGD",
        message:
          "Government market API key is missing. Add MARKET_API_KEY to src/server/.env",
      });
    }

    // ==================================================
    // QUERY PARAMETERS
    // ==================================================

    const params = new URLSearchParams();

    params.set(
      "api-key",
      apiKey
    );

    params.set(
      "format",
      "json"
    );

    // Government API maximum practical page
    params.set(
      "limit",
      "1000"
    );

    params.set(
      "offset",
      "0"
    );

    if (state) {
      params.set(
        "filters[state.keyword]",
        state
      );
    }

    if (district) {
      params.set(
        "filters[district]",
        district
      );
    }

    if (market) {
      params.set(
        "filters[market]",
        market
      );
    }

    if (normalizedCommodity) {
      params.set(
        "filters[commodity]",
        normalizedCommodity
      );
    }

    const requestUrl =
      `${MARKET_API_URL}?${params.toString()}`;

    console.log(
      "Government API:",
      requestUrl.replace(
        apiKey,
        "********"
      )
    );

    // ==================================================
    // FETCH GOVERNMENT DATA
    // ==================================================

    const response = await fetch(
      requestUrl,
      {
        method: "GET",
        headers: {
          Accept:
            "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "❌ Government API Status:",
        response.status
      );

      console.error(
        "Government API Response:",
        errorText.substring(
          0,
          500
        )
      );

      return res.status(502).json({
        success: false,
        source:
          "AGMARKNET / Government OGD",
        count: 0,
        data: [],
        message:
          "Government mandi price service is temporarily unavailable.",
      });
    }

    const result =
      await response.json();

    const records =
      Array.isArray(result.records)
        ? result.records
        : [];

    console.log(
      "✅ Government records:",
      records.length
    );

    // ==================================================
    // TRANSFORM DATA
    // ==================================================

    let marketData =
      records.map((item) => {
        const commodityName =
          item.commodity ||
          item.Commodity ||
          "";

        const stateName =
          item.state ||
          item.State ||
          "";

        const districtName =
          item.district ||
          item.District ||
          "";

        const marketName =
          item.market ||
          item.Market ||
          "";

        const variety =
          item.variety ||
          item.Variety ||
          "";

        const grade =
          item.grade ||
          item.Grade ||
          "";

        const arrivalDate =
          item.arrival_date ||
          item.Arrival_Date ||
          "";

        const minPrice =
          toNumber(
            item.min_price ??
              item.Min_Price
          );

        const maxPrice =
          toNumber(
            item.max_price ??
              item.Max_Price
          );

        const modalPrice =
          toNumber(
            item.modal_price ??
              item.Modal_Price
          );

        return {
          state: stateName,
          district: districtName,
          market: marketName,
          commodity: commodityName,
          variety,
          grade,
          arrivalDate,

          minPrice,
          maxPrice,
          modalPrice,

          category:
            getCategory(
              commodityName
            ),

          unit:
            "₹ / Quintal",

          source:
            "AGMARKNET / Government OGD",
        };
      });

    // ==================================================
    // REMOVE RECORDS WITHOUT PRICE
    // ==================================================

    marketData =
      marketData.filter(
        (item) =>
          item.minPrice !== null ||
          item.maxPrice !== null ||
          item.modalPrice !== null
      );

    // ==================================================
    // CATEGORY FILTER
    // ==================================================

    if (
      category &&
      category.toLowerCase() !== "all"
    ) {
      marketData =
        marketData.filter(
          (item) =>
            item.category
              .toLowerCase() ===
            category.toLowerCase()
        );
    }

    // ==================================================
    // SORT NEWEST FIRST
    // ==================================================

    marketData.sort(
      (a, b) =>
        parseDate(
          b.arrivalDate
        ) -
        parseDate(
          a.arrivalDate
        )
    );

    // ==================================================
    // UNIQUE STATS
    // ==================================================

    const commodities =
      new Set(
        marketData
          .map(
            (item) =>
              item.commodity
          )
          .filter(Boolean)
      );

    const markets =
      new Set(
        marketData
          .map(
            (item) =>
              item.market
          )
          .filter(Boolean)
      );

    const states =
      new Set(
        marketData
          .map(
            (item) =>
              item.state
          )
          .filter(Boolean)
      );

    const districts =
      new Set(
        marketData
          .map(
            (item) =>
              item.district
          )
          .filter(Boolean)
      );

    // ==================================================
    // LATEST DATE
    // ==================================================

    const dates =
      marketData
        .map(
          (item) =>
            item.arrivalDate
        )
        .filter(Boolean);

    let latestDate = "";

    if (dates.length > 0) {
      latestDate =
        dates.reduce(
          (
            latest,
            current
          ) =>
            parseDate(
              current
            ) >
            parseDate(
              latest
            )
              ? current
              : latest,
          dates[0]
        );
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    console.log(
      "✅ Final records:",
      marketData.length
    );

    console.log(
      "📅 Latest date:",
      latestDate || "N/A"
    );

    console.log(
      "========================================"
    );

    return res.json({
      success: true,

      source:
        "AGMARKNET / Government OGD",

      count:
        marketData.length,

      data:
        marketData,

      stats: {
        commodities:
          commodities.size,

        markets:
          markets.size,

        states:
          states.size,

        districts:
          districts.size,

        latestDate:
          latestDate,
      },

      filters: {
        state,
        district,
        market,
        commodity,
        normalizedCommodity,
        category,
      },

      fetchedAt:
        new Date().toISOString(),

      message:
        marketData.length > 0
          ? "Real daily mandi prices fetched successfully."
          : "No official price records found for the selected filters.",
    });
  } catch (error) {
    console.error("");
    console.error(
      "========================================"
    );
    console.error(
      "❌ MARKET API ERROR"
    );
    console.error(
      error.message
    );
    console.error(
      "========================================"
    );

    return res.status(500).json({
      success: false,

      source:
        "AGMARKNET / Government OGD",

      count: 0,

      data: [],

      message:
        "Unable to fetch real Government mandi prices right now.",
    });
  }
});

export default router;