import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import image from '../assets/leonardo-miranda-dvF6s1H1x68-unsplash.jpg';
import { useNavigation } from '@react-navigation/native';



const NewStoryCard = ({ title, description }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.mediaContainer}>
        <Image source={require('../assets/leonardo-miranda-dvF6s1H1x68-unsplash.jpg')} style={styles.imageStyle} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonRender]}>
          <Text style={styles.buttonText}>Render</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('DirectorChat')}
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
