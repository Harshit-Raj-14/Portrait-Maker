require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Media = require("./models/Media");
const { uploadToCloudinary } = require("./cloudinaryService");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Upload Media
app.post("/upload", async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) return res.status(400).json({ error: "File URL required" });

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(fileUrl);

    // Save to MongoDB
    const newMedia = new Media({ url: cloudinaryUrl });
    await newMedia.save();

    res.json({ success: true, url: cloudinaryUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch Media
app.get("/media", async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
