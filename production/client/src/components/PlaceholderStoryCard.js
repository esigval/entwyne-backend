// PlaceholderStoryCard.js
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const PlaceholderStoryCard = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text>Loading new story...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    
container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },

});

export default PlaceholderStoryCard;