export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  // 🔓 OPEN CORS (DEV ONLY)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // 🟡 Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ⬇️ Forward body apa adanya
    const apiRes = await fetch(
      "https://api.ferdev.my.id/remote/elfar",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`
        },
        body: req
      }
    );

    const text = await apiRes.text();

    res.status(apiRes.status).send(text);
  } catch (err) {
    res.status(500).json({
      error: "Proxy failed",
      message: err.message
    });
  }
}
