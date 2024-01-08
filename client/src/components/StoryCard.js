import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import image from '../assets/leonardo-miranda-dvF6s1H1x68-unsplash.jpg';
import { useNavigation } from '@react-navigation/native';



const NewStoryCard = ({ title, description, onDeletePress, id, threadId }) => {
  const navigation = useNavigation();
  const navigateToDirectorChat = () => {
    navigation.navigate('DirectorChat', { storyId: id, threadId: threadId});
  };
  return (
    <View style={styles.container}>

      <View style={styles.mediaContainer}>
        <Image source={image} style={styles.imageStyle} />
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDeletePress(id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description || 'No description available'}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonRender]}>
          <Text style={styles.buttonText}>Render</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={navigateToDirectorChat} // Use the new function here
        >
          <Text style={styles.buttonText}>AI Director</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Twynes</Text>
        </TouchableOpacity>
      </View>
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
  deleteButton: {
    position: 'absolute',
    top: 185, // Adjust the value to match your design
    right: 20, // Adjust the value to match your design
    backgroundColor: 'red', // Use your desired background color
    padding: 8,
    borderRadius: 4,
    zIndex: 1, // Ensure the button is above other elements
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mediaContainer: {
    height: 150, // Adjust the height as needed
    backgroundColor: '#E0E0E0', // Placeholder color
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  mediaPlaceholderText: {
    color: '#333',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#F3F3F3',
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  buttonRender: {
    backgroundColor: '#BB6BD9', // Purple color for the 'Render' button
  },
  buttonText: {
    color: '#333',
    fontSize: 14,
  },
});

export default NewStoryCard;
