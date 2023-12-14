import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const uploadVideoToS3 = async (videoUri) => {
  try {
    // Get the pre-signed URL from your backend
    const { data: { presignedUrl } } = await axios.get('YOUR_BACKEND_ENDPOINT');

    // Read the file into a blob
    const videoBlob = await FileSystem.readAsStringAsync(videoUri, { encoding: FileSystem.EncodingType.Base64 });

    // Upload the file to S3
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: videoBlob,
      headers: {
        'Content-Type': 'video/mp4',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload video to S3');
    }

    console.log('Video uploaded successfully!');
  } catch (error) {
    console.error('Error uploading video:', error);
  }
};
