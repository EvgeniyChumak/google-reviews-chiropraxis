const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = async (req, res) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const placeId = process.env.PLACE_ID;

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Добавляем лог для проверки
    console.log("Google API response:", data);

    if (data.status !== "OK") {
      return res
        .status(400)
        .json({ error: data.status, message: data.error_message });
    }

    res.status(200).json({
      rating: data.result.rating,
      total: data.result.user_ratings_total,
      reviews: data.result.reviews?.slice(0, 5) || [],
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Failed to fetch Google reviews" });
  }
};
