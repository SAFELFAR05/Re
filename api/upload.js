export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {

  // 🔓 OPEN CORS FULL (SEMUA DIBOLEHKAN)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Allow POST only
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const response = await fetch(
      "https://api.ferdev.my.id/remote/elfar",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer key-elfs"
        },
        body: req,       // stream langsung
        duplex: "half"   // 🔥 WAJIB (Node/Vercel)
      }
    );

    const contentType = response.headers.get("content-type") || "";

    // Teruskan JSON mentah
    if (contentType.includes("application/json")) {
      const json = await response.json();
      return res.status(response.status).json(json);
    }

    // Fallback text
    const text = await response.text();
    return res.status(response.status).send(text);

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Proxy failed",
      message: err.message
    });
  }
}
