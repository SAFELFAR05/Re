export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    // Proxy request ke API asli
    const response = await fetch("https://api.ferdev.my.id/remote/elfar", {
      method: "POST",
      headers: {
        Authorization: "Bearer key-elfs"
      },
      body: req,          // stream langsung
      duplex: "half"      // 🔥 WAJIB di Node/Vercel
    });

    const contentType = response.headers.get("content-type") || "";

    // Jika JSON → teruskan JSON
    if (contentType.includes("application/json")) {
      const json = await response.json();
      return res.status(response.status).json(json);
    }

    // Fallback (text / error HTML)
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
