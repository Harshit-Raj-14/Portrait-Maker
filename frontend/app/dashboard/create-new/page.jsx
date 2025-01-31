"use client";
import React, { useState, useEffect } from "react";
import UploadComponent from "./_components/UploadComponent";

function CreateNew() {
  const [uploadedMedia, setUploadedMedia] = useState([]);

  useEffect(() => {
    fetchUploadedMedia();
  }, []);

  const fetchUploadedMedia = async () => {
    try {
      const res = await fetch("http://localhost:5000/media");
      const data = await res.json();
      setUploadedMedia(data);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    }
  };

  const handleUploadSuccess = (newMedia) => {
    setUploadedMedia((prev) => [newMedia, ...prev]);
  };

  return (
    <div className="md:px-20">
      <h2 className="text-xl font-bold text-primary">Upload</h2>
      <h2 className="text-4xl font-bold text-primary text-center">Create New</h2>
      
      <div className="mt-2 shadow-md p-10">
        <UploadComponent onUploadSuccess={handleUploadSuccess} />
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-bold text-primary">Generated Portraits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {uploadedMedia.map((media, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Source Image</h4>
                  <img 
                    src={media.imageUrl} 
                    alt="Source" 
                    className="w-full h-40 object-cover rounded"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Source Video</h4>
                  <video controls className="w-full h-40 rounded">
                    <source src={media.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-1">Generated Portrait</h4>
                {media.status === 'completed' && media.portraitUrl ? (
                  <div>
                    <video controls className="w-full h-48 rounded">
                      <source src={media.portraitUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <a 
                      href={media.portraitUrl}
                      download
                      className="mt-2 inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Download Portrait
                    </a>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center bg-gray-100 rounded">
                    <p className="text-gray-500">
                      {media.status === 'processing' ? 'Processing...' : 
                       media.status === 'failed' ? 'Generation failed' : 
                       'Pending processing'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreateNew;