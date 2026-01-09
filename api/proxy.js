const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Support 'url', 'link', and 'u' parameters
  // Handle cases where the URL might have multiple question marks or query params
  const fullUrl = req.url;
  const urlMatch = fullUrl.match(/[?&](?:u|link|url)=(https?:\/\/.*)/i);
  const url = urlMatch ? decodeURIComponent(urlMatch[1]) : (req.query.link || req.query.url || req.query.u);
  const filename = req.query.filename || 'video.mp4';

  if (!url) {
    return res.status(400).send("URL/Link is required");
  }

  try {
    // Ambil data dari link sumber
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    // Set header agar browser otomatis download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp4');

    // Alirkan data langsung ke user (streaming)
    response.body.pipe(res);

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).send("Failed to download file");
  }
};
