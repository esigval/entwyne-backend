import axios from 'axios';
import { API_BASE_URL } from '../../config';

const uploadVideoToS3 = async (videoUri, promptId, videoType) => {
  try {
    console.log('promptId:', promptId); // Make sure promptId is correct
    console.log('videoUri:', videoUri); // Make sure videoUri is correct
    console.log('videoType:', videoType); // Make sure videoType is correct (e.g., video/mp4
    // Get the pre-signed URL from your backend
    const { data: { presignedUrl, newTwyneId } } = await axios.get(`${API_BASE_URL}/v1/getS3PresignedUrl?promptId=${promptId}&videoUri=${encodeURIComponent(videoUri)}`);
    console.log('presignedUrl:', presignedUrl); // Make sure presignedUrl is correct
    console.log('newTwyneId:', newTwyneId); // Make sure newTwyneId is correct (e.g., 60b9b4b7e6b3f3b4a8f7b7a5

    /* Fetch the video file as a blob directly from the file URI
    const blob = await fetch(videoUri);
    const videoBlob = await response.blob();
    */
    
    // Upload the file to S3
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: videoUri,
      headers: {
        'Content-Type': videoType ? videoType : 'video/mp4',
      },
    });

    console.log('uploadResponse:', uploadResponse); // Debug log

    if (!uploadResponse.ok) {
      const errorResponseText = await uploadResponse.text();
      console.error('S3 upload error response:', errorResponseText);
      throw new Error('Failed to upload video to S3');
    }

    console.log('Video uploaded successfully!');
    return newTwyneId;
  } catch (error) {
    console.error('Error uploading video:', error);
  }
};

export default uploadVideoToS3;
