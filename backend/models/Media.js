const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    portraitUrl: { type: String },
    status: { 
      type: String, 
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", MediaSchema);