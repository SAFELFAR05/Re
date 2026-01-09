export default function handler(req, res) {
  let { u, filename } = req.query

  if (!u) {
    return res.status(400).json({ error: "Missing url" })
  }

  u = decodeURIComponent(u).trim()

  const name = filename
    ? filename.replace(/[^\w\d.-]+/g, "_")
    : "video.mp4"

  res.setHeader("Content-Disposition", `attachment; filename="${name}"`)
  res.setHeader("Cache-Control", "no-store")

  // 🔥 PENTING: redirect, BUKAN fetch
  return res.redirect(302, u)
}
