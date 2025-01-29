"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../../../components/ui/button";
import UploadComponent from "./_components/UploadComponent";

function CreateNew() {
  const [uploadedMedia, setUploadedMedia] = useState([]);

  useEffect(() => {
    fetchUploadedMedia();
  }, []);

  const fetchUploadedMedia = async () => {
    try {
      const res = await axios.get("http://localhost:5000/media");
      setUploadedMedia(res.data);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    }
  };

  const handleUploadSuccess = (newUrl) => {
    setUploadedMedia((prev) => [...prev, { url: newUrl }]);
  };

  return (
    <div className="md:px-20">
      <h2 className="text-xl font-bold text-primary">Upload </h2>
      <h2 className="text-4xl font-bold text-primary text-center">Create New</h2>
      <div className="mt-2 shadow-md p-10">
        <UploadComponent onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Render Uploaded Files */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-primary">Uploaded Files</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {uploadedMedia.map((media, index) => (
            <div key={index} className="border p-2">
              {media.url.match(/\.(jpeg|jpg|png|gif)$/) ? (
                <img src={media.url} alt="Uploaded" className="w-full h-40 object-cover" />
              ) : (
                <video controls className="w-full h-40">
                  <source src={media.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreateNew;
