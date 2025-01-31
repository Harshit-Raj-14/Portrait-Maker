require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { fal } = require("@fal-ai/client");
const Media = require("./models/Media");
const { uploadToCloudinary } = require("./cloudinaryService");

const app = express();
app.use(express.json());
app.use(cors());

// Configure Fal AI client
fal.config({
  credentials: process.env.FAL_KEY
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Upload Media and Process with Fal AI
app.post("/upload", async (req, res) => {
  console.log("🚀 Received upload request with body:", req.body);
  
  try {
    const { imageUrl, videoUrl } = req.body;
    if (!imageUrl || !videoUrl) {
      console.log("❌ Missing required URLs:", { imageUrl, videoUrl });
      return res.status(400).json({ error: "Both image and video URLs are required" });
    }

    console.log("📤 Starting Cloudinary uploads...");
    // Upload both files to Cloudinary
    try {
      const [cloudinaryImageUrl, cloudinaryVideoUrl] = await Promise.all([
        uploadToCloudinary(imageUrl),
        uploadToCloudinary(videoUrl)
      ]);
      console.log("✅ Cloudinary uploads successful:", {
        cloudinaryImageUrl,
        cloudinaryVideoUrl
      });

      // Create new media entry
      console.log("📝 Creating new media entry...");
      const newMedia = new Media({
        imageUrl: cloudinaryImageUrl,
        videoUrl: cloudinaryVideoUrl,
        status: 'processing'
      });
      await newMedia.save();
      console.log("✅ Media entry created:", newMedia);

      // Process with Fal AI
      console.log("🤖 Starting Fal AI processing...");
      try {
        console.log("Sending to Fal AI with inputs:", {
          image_url: cloudinaryImageUrl,
          video_url: cloudinaryVideoUrl
        });

        const result = await fal.subscribe("fal-ai/live-portrait", {
          input: {
            image_url: cloudinaryImageUrl,
            video_url: cloudinaryVideoUrl
          },
          pollInterval: 5000, // Poll every 5 seconds
          logs: true,
          onQueueUpdate: (update) => {
            console.log("🔄 Fal AI Queue Update:", update);
            if (update.status === "IN_PROGRESS") {
              update.logs.map((log) => log.message).forEach(msg => 
                console.log("📝 Fal AI Progress:", msg)
              );
            }
          }
        });

        console.log("✅ Fal AI processing complete:", result);

        // Update media entry with portrait URL
        console.log("📝 Updating media entry with portrait URL...");
        newMedia.portraitUrl = result.video.url;
        newMedia.status = 'completed';
        await newMedia.save();
        console.log("✅ Media entry updated:", newMedia);

        res.json({
          success: true,
          media: newMedia
        });
      } catch (falError) {
        console.error("❌ Fal AI processing failed:", falError);
        newMedia.status = 'failed';
        await newMedia.save();
        throw falError;
      }
    } catch (cloudinaryError) {
      console.error("❌ Cloudinary upload failed:", cloudinaryError);
      throw cloudinaryError;
    }
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch Media
app.get("/media", async (req, res) => {
  console.log("📥 Fetching media...");
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${media.length} media items`);
    res.json(media);
  } catch (error) {
    console.error("❌ Failed to fetch media:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));