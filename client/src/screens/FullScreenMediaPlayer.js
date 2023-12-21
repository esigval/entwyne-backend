import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

const FullScreenMediaScreen = ({ route }) => {
  const { imageUrl, videoUri } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Video
        source={{ uri: 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%40anonymous%2Fclient-eff9869a-ef69-4898-b2a8-d8bc07f9d9e7/Camera/f03b706e-17d4-4c50-bfd7-7f40ef5c1dc6.mp4' }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        isLooping
        useNativeControls
        style={styles.video}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%', // Adjust as needed
    resizeMode: 'cover',
  },
  video: {
    width: '100%',
    height: 300, // Adjust as needed
  },
});

export default FullScreenMediaScreen;
