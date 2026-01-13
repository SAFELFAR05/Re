export default async function handler(req, res) {
  // ===== CORS FULL BEBASS =====
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { prompt, logic } = req.query;

    if (!prompt) {
      return res.status(400).json({
        error: "prompt is required"
      });
    }

    const API_KEY = process.env.FERDEV_API_KEY;

    const targetUrl = new URL("https://api.ferdev.my.id/ai/gptlogic");
    targetUrl.searchParams.append("prompt", prompt);
    if (logic) targetUrl.searchParams.append("logic", logic);
    targetUrl.searchParams.append("apikey", API_KEY);

    const response = await fetch(targetUrl.toString());
    const data = await response.json();

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({
      error: "Proxy error",
      message: err.message
    });
  }
}
