import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 16; // Subtract some margin

const MediaCard = ({ prompt, characters, capturedBy, description }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {/* Replace with an actual <Image> tag or media component */}
        <Text style={styles.imagePlaceholderText}>Picture Media Here</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.promptText}>Prompt(s): {prompt}</Text>
        <Text style={styles.charactersText}>Characters: {characters.join(', ')}</Text>
        <Text style={styles.capturedByText}>Captured By: {capturedBy}</Text>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  imagePlaceholderText: {
    color: '#333',
  },
  contentContainer: {
    padding: 8,
  },
  promptText: {
    fontWeight: 'bold',
  },
  charactersText: {
    color: '#333',
  },
  capturedByText: {
    color: '#333',
  },
  descriptionText: {
    color: '#666',
  },
});

export default MediaCard;