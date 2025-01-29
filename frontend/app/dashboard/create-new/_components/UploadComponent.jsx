"use client";
import React, { useState } from "react";
import { Widget } from "@uploadcare/react-widget";
import axios from "axios";

function UploadComponent({ onUploadSuccess }) {
  const [fileUrl, setFileUrl] = useState("");

  const handleUpload = async () => {
    if (!fileUrl) {
      alert("Please select a file!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/upload", { fileUrl });

      if (response.data.success) {
        onUploadSuccess(response.data.url); // Pass URL to parent component
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="text-center">
      {/* UploadCare React Widget */}
      <Widget
        publicKey={process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY} // Use env variable here
        tabs="file camera url facebook gdrive"
        clearable
        onChange={(file) => setFileUrl(file.cdnUrl)} // Get file URL from widget
      />
      
      <button
        onClick={handleUpload}
        className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg"
      >
        Upload
      </button>
    </div>
  );
}

export default UploadComponent;
