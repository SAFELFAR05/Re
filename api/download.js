export default function handler(req, res) {
  let { u, filename } = req.query

  if (!u) {
    return res.status(400).json({ error: "Missing url" })
  }

  u = decodeURIComponent(u).trim()

  const name = filename
    ? filename.replace(/[^\w\d.-]+/g, "_")
    : "video.mp4"

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${name}"`
  )
  res.setHeader("Cache-Control", "no-store")
  res.setHeader("Referrer-Policy", "no-referrer")

  // 🔥 INI KUNCINYA
  return res.redirect(307, u)
}
