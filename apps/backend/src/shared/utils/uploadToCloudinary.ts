import { v2 as cloudinary } from 'cloudinary';

/**
 * Uploads multiple files to Cloudinary
 * @param files - Array of files from Multer (req.files)
 */
export const uploadToCloudinary = async (files: any[]) => {
  try {
    // Create an array of upload promises
    const uploadPromises = files.map(
      (file: any) =>
        new Promise((resolve, reject) => {
          // Open a stream to Cloudinary
          cloudinary.uploader
            .upload_stream(
              {
                folder: 'variants', // Organize images in a 'variants' folder
                resource_type: 'image',
                fetch_format: 'webp', // Convert to WebP for better speed
                quality: 'auto' // Automatic compression
              },
              (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error('Upload failed'));
                // Return the secure URL and public ID
                resolve({
                  url: result.secure_url,
                  public_id: result.public_id
                });
              }
            )
            .end(file.buffer); // Write the file buffer to the stream
        })
    );

    // Wait for all uploads to finish (even if some fail)
    const results = await Promise.allSettled(uploadPromises);

    // Return only the successful uploads
    return results.filter(result => result.status === 'fulfilled').map((result: any) => result.value);
  } catch (error) {
    console.error('Cloudinary Util Error:', error);
    return [];
  }
};
