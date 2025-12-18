import RateLimit from "../models/RateLimit.js";

const WINDOW_SIZE = 60 * 1000; // 1 minute
const USER_LIMIT = 5;
const IP_LIMIT = 20;

const rateLimiter = async (req, res, next) => {
  try {
    const userId = req.headers.userid;
    if (!userId) {
      return res.status(400).json({ message: "userId header is required" });
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;

    const now = new Date();

    // Check User Limit
    await checkLimit(`USER_${userId}`, USER_LIMIT, now);

    // Check IP Limit
    await checkLimit(`IP_${ip}`, IP_LIMIT, now);

    next();
  } catch (error) {
    return res.status(429).json({ message: error.message });
  }
};

const checkLimit = async (key, limit, now) => {
  const record = await RateLimit.findOne({ key });

  if (!record) {
    await RateLimit.create({ key, count: 1, windowStart: now });
    return;
  }

  if (now - record.windowStart > WINDOW_SIZE) {
    record.count = 1;
    record.windowStart = now;
  } else {
    record.count += 1;
    if (record.count > limit) {
      throw new Error(`Rate limit exceeded for ${key}`);
    }
  }

  await record.save();
};

export default rateLimiter;
