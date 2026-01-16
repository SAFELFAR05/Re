import axios from "axios";
import FormData from "form-data";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  // Open CORS full (debug)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 1️⃣ Parse multipart dari browser
    const form = formidable({ multiples: false });
    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ files });
      });
    });

    const file = files.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File tidak ditemukan di proxy"
      });
    }

    // 2️⃣ Buat ulang FormData (SAMA PERSIS DOKUMENTASI)
    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.filepath));

    // 3️⃣ Kirim ke API ferdev
    const response = await axios.post(
      "https://api.ferdev.my.id/remote/elfar",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: "Bearer key-elfs"
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );

    return res.status(200).json(response.data);

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
