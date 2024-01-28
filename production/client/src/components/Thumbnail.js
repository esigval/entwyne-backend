import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

const Thumbnail = ({ source }) => {
  return (
    <View style={styles.thumbnail}>
      <Image source={source} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    width: 30, // Adjust size as needed
    height: 30, // Adjust size as needed
    borderRadius: 15, // Half of width/height for circle shape
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    fallback: 'https://via.placeholder.com/150',
  },
});

export default Thumbnail;
