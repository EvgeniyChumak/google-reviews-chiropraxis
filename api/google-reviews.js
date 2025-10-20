const fetch = require("node-fetch");

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // Parse query (?refresh=1 to bypass CDN cache)
  const urlObj = new URL(req.url, "http://localhost");
  const refresh = urlObj.searchParams.get("refresh") === "1";

  if (refresh) {
    // Do NOT cache this response
    res.setHeader("Cache-Control", "no-store");
  } else {
    // Cache at Vercel's edge for 7 days; serve stale for 1 day while revalidating
    // 7 days = 604800s
    res.setHeader(
      "Cache-Control",
      "s-maxage=604800, stale-while-revalidate=86400"
    );
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${process.env.PLACE_ID}&fields=rating,user_ratings_total&key=${process.env.GOOGLE_API_KEY}`;
    const gRes = await fetch(url);
    const data = await gRes.json();

    if (data.status !== "OK") {
      return res
        .status(400)
        .json({ error: data.status, message: data.error_message });
    }

    return res.status(200).json({
      rating: data.result.rating,
      total: data.result.user_ratings_total,
    });
  } catch (err) {
    console.error("Server error:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch Google rating data" });
  }
};
