export default async function handler(req, res) {
  // 1. Kasih izin buat semua domain (Anti-CORS)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Boleh diakses dari mana saja
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // 2. Handle OPTIONS request (Preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let { link } = req.query;
  if (!link) return res.status(400).json({ success: false, message: "Missing link" });

  link = link.trim();

  try {
    const ferdevUrl = `${process.env.FERDEV_API_URL}?link=${encodeURIComponent(link)}&apikey=${process.env.FERDEV_API_KEY}`;

    const response = await fetch(ferdevUrl);
    const data = await response.json();

    // 3. Tambahin cache control & success flag biar frontend enak bacanya
    res.setHeader("Cache-Control", "no-store");
    
    // Pastikan kita balikin struktur yang konsisten
    res.status(200).json({
      success: true,
      data: data.data || data.result || data // Fallback kalau struktur API berubah
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Resolve error", details: err.message });
  }
}
