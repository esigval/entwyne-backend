import axios from 'axios';

const uploadVideoToS3 = async (videoUri, promptId) => {
  try {
    console.log('promptId:', promptId); // Make sure promptId is correct
    // Get the pre-signed URL from your backend
    const { data: { presignedUrl } } = await axios.get(`${process.env.LOCAL_NODE_SERVER}/v1/getS3PresignedUrl?promptId=${promptId}&videoUri=${encodeURIComponent(videoUri)}`);
    console.log('presignedUrl:', presignedUrl); // Make sure presignedUrl is correct

    // Fetch the video file as a blob directly from the file URI
    const response = await fetch(videoUri);
    const videoBlob = await response.blob();

    // Upload the file to S3
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: videoBlob,
      headers: {
        'Content-Type': 'video/mp4',
      },
    });

    if (!uploadResponse.ok) {
      const errorResponseText = await uploadResponse.text();
      console.error('S3 upload error response:', errorResponseText);
      throw new Error('Failed to upload video to S3');
    }

    console.log('Video uploaded successfully!');
  } catch (error) {
    console.error('Error uploading video:', error);
  }
};

export default uploadVideoToS3;
