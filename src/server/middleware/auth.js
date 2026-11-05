import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("========== AUTH DEBUG ==========");
  console.log("Header exists:", !!authHeader);
  console.log("Starts with Bearer:", authHeader?.startsWith("Bearer "));
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication header missing",
    });
  }

  const token = authHeader.split(" ")[1];

  console.log("Token exists:", !!token);
  console.log("Token length:", token?.length);

  try {
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    console.log("JWT_SECRET length:", process.env.JWT_SECRET?.length);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("JWT VERIFIED ✅");
    console.log("User ID:", decoded.userId);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT VERIFY FAILED ❌");
    console.log("Error name:", error.name);
    console.log("Error message:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default protect;