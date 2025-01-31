import React, { useState } from "react";
import { Widget } from "@uploadcare/react-widget";

function UploadComponent({ onUploadSuccess }) {
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!imageUrl || !videoUrl) {
      alert("Please select both an image and a video!");
      return;
    }

    setIsUploading(true);
    console.log("🚀 Starting upload with:", { imageUrl, videoUrl });

    try {
      console.log("📤 Sending request to server...");
      const response = await fetch("http://localhost:5000/upload", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl, videoUrl })
      });

      const data = await response.json();
      console.log("📥 Server response:", data);
      
      if (data.success) {
        console.log("✅ Upload successful!");
        onUploadSuccess(data.media);
        setImageUrl("");
        setVideoUrl("");
      } else {
        console.error("❌ Upload failed:", data.error);
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (file) => {
    console.log("📸 Image selected:", file);
    setImageUrl(file.cdnUrl);
  };

  const handleVideoChange = (file) => {
    console.log("🎥 Video selected:", file);
    setVideoUrl(file.cdnUrl);
  };

  return (
    <div className="text-center space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Upload Image</h3>
        <Widget
          publicKey={process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY}
          tabs="file camera url facebook gdrive"
          clearable
          onChange={handleImageChange}
          imagesOnly
        />
        {imageUrl && <p className="text-sm text-green-600 mt-2">✅ Image selected</p>}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Upload Video</h3>
        <Widget
          publicKey={process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY}
          tabs="file camera url facebook gdrive"
          clearable
          onChange={handleVideoChange}
          videoOnly
        />
        {videoUrl && <p className="text-sm text-green-600 mt-2">✅ Video selected</p>}
      </div>

      <button
        onClick={handleUpload}
        disabled={!imageUrl || !videoUrl || isUploading}
        className={`px-6 py-3 rounded-lg ${
          !imageUrl || !videoUrl || isUploading
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white transition-colors`}
      >
        {isUploading ? 'Processing...' : 'Generate Portrait'}
      </button>

      {isUploading && (
        <div className="mt-4 text-blue-600">
          <p>Processing your request... This may take a few minutes.</p>
          <p className="text-sm">Check the console for progress updates.</p>
        </div>
      )}
    </div>
  );
}

export default UploadComponent;