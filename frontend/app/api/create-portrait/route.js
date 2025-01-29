// app/api/create-portrait/route.js
import { fal } from "@fal-ai/client";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
});

// Configure fal.ai client
fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_KEY
});

export async function POST(request) {
  try {
    const { imageUrl, videoUrl } = await request.json();

    // Submit the request to fal.ai
    const result = await fal.subscribe("fal-ai/live-portrait", {
      input: {
        image_url: imageUrl,
        video_url: videoUrl
      },
      logs: true
    });

    // Upload the result video to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(result.data.output_url, {
      resource_type: "video"
    });

    return Response.json({ 
      resultUrl: uploadResponse.secure_url 
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return Response.json(
      { message: 'Error processing your request' }, 
      { status: 500 }
    );
  }
}