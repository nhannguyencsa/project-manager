import arcjet, { shield, detectBot, tokenBucket, validateEmail } from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";

/*
file nay dungd dde set rule cấu hình (rate limit, bot detection, IP check…)
Đoạn code trên khởi tạo Arcjet trong Express app với 3 lớp bảo vệ:
Shield → Ngăn SQL injection, XSS, tấn công phổ biến.
DetectBot → Phát hiện và chặn bot, chỉ cho phép search engine bot.
TokenBucket → Giới hạn tốc độ request: max 10 request / 10 giây cho mỗi IP
*/
const aj = arcjet({
  // Get your site key from https://app.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: process.env.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        // Uncomment to allow these other common bot categories
        // See the full list at https://arcjet.com/bot-list
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
    //validateEmail
    validateEmail({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // block disposable, invalid, and email addresses with no MX records
      deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE",
      // Tracked by IP address by default, but this can be customized
      // See https://docs.arcjet.com/fingerprints
      //characteristics: ["ip.src"],
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

export default aj;