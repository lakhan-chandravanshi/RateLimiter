import express from "express";
import rateLimiter from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/data", rateLimiter, (req, res) => {
  res.json({
    success: true,
    message: "Data fetched successfully"
  });
});

export default router;
