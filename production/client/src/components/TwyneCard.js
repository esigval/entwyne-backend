import React from 'react';
import { View, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 16; // Subtract some margin

const TwyneCard = ({ imageUrl }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }}/>
      </View>
    </View>
  );
};

const styles = {
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 3,
    margin: 8,
  },
  imageContainer: {
    height: 120, // Set the height you want
    backgroundColor: '#e1e4e8', // Placeholder color
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default TwyneCard;