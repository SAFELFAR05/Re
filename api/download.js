export default async function handler(req, res) {
  const { u, filename } = req.query

  if (!u) {
    return res.status(400).send("Missing media url")
  }

  try {
    const response = await fetch(u, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    })

    if (!response.ok || !response.body) {
      return res.status(410).send("Media expired")
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename || "video.mp4"}"`
    )
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/octet-stream"
    )
    res.setHeader("Cache-Control", "no-store")

    const reader = response.body.getReader()
    res.status(200)

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(Buffer.from(value))
    }

    res.end()
  } catch (err) {
    res.status(500).send("Download failed")
  }
}
