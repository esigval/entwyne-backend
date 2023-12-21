import React, { useRef } from 'react'; // Make sure to import useRef here
import { View, Button, StyleSheet } from 'react-native';
import { Video } from 'expo-av'; // Ensure Video is imported correctly
import uploadVideoToS3 from '../functions/uploadVideoToS3';

const VideoConfirmationScreen = ({ route }) => {
  // Retrieve the video URI from route.params
  const { videoUri } = route.params;
  const { promptId } = route.params;
  const videoRef = useRef(null); // Reference to the video player

  const handleSend = async () => {
    await uploadVideoToS3(videoUri, promptId);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: videoUri }}
        useNativeControls
        resizeMode="cover"
        isLooping
        onPlaybackStatusUpdate={(status) => {
          // Handle the playback status updates if needed
        }}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    width: '100%',
    height: 600, // You can adjust this as needed
  },
  
  // ... other styles ...
});

export default VideoConfirmationScreen;
