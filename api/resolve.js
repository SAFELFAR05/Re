export default async function handler(req, res) {
  let { link } = req.query
  if (!link) return res.status(400).json({ error: "Missing link" })

  link = link.trim() // hapus spasi depan / belakang

  try {
    const ferdevUrl =
      `${process.env.FERDEV_API_URL}?link=${encodeURIComponent(link)}` +
      `&apikey=${process.env.FERDEV_API_KEY}`

    const response = await fetch(ferdevUrl)
    const data = await response.json()

    // langsung return apa adanya, tanpa filter
    res.setHeader("Cache-Control", "no-store")
    res.status(200).json(data)

  } catch (err) {
    res.status(500).json({ error: "Resolve error", details: err.message })
  }
}
