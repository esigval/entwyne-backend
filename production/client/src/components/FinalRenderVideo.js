import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import ReactPlayer from 'react-player';

const FinalRenderVideo = ({ storylineId }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/v1/finalRender/${storylineId}`);
        setVideoUrl(response.data.url);
        setThumbnailUrl(response.data.thumbnailUrl);
      } catch (error) {
        console.error('Failed to fetch video URL:', error);
      }
    };

    fetchVideoUrl();
  }, [storylineId]);

  return (
    <div>
      {videoUrl && (
        <ReactPlayer
          url={videoUrl}
          playing
          controls
          width='100%'
          
          light={thumbnailUrl}
        />
      )}
    </div>
  );
};

export default FinalRenderVideo;