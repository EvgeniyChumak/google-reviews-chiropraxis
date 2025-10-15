import fetch from "node-fetch";

export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const placeId = process.env.PLACE_ID;

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  res.status(200).json({
    rating: data.result.rating,
    total: data.result.user_ratings_total,
    reviews: data.result.reviews?.slice(0, 5) || [],
  });
}
