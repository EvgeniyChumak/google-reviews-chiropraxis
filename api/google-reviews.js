const fetch = require("node-fetch");

module.exports = async (req, res) => {
  // Enable CORS for all domains
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight (OPTIONS) request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  const placeId = process.env.PLACE_ID;

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      return res
        .status(400)
        .json({ error: data.status, message: data.error_message });
    }

    // Send only rating and total reviews count
    res.status(200).json({
      rating: data.result.rating,
      total: data.result.user_ratings_total,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Failed to fetch Google rating data" });
  }
};
