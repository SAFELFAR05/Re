export default async function handler(req, res) {
  const { link } = req.query

  if (!link) {
    return res.status(400).json({ error: "Missing link" })
  }

  try {
    const ferdevUrl =
      `${process.env.FERDEV_API_URL}?` +
      `link=${encodeURIComponent(link)}` +
      `&apikey=${process.env.FERDEV_API_KEY}`

    const response = await fetch(ferdevUrl)
    const data = await response.json()

    if (!response.ok || data.status === false) {
      return res.status(500).json({ error: "Failed to resolve media" })
    }

    // OPTIONAL: filter biar cuma media aman (video+audio)
    const medias = (data.medias || []).filter(
      m => m.type === "video" && m.is_audio === true
    )

    res.setHeader("Cache-Control", "no-store")
    res.status(200).json({
      title: data.title,
      source: data.source,
      thumbnail: data.thumbnail,
      duration: data.duration,
      medias
    })
  } catch (err) {
    res.status(500).json({ error: "Resolve error" })
  }
}
