// EntwyneComponent.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const WebMarketingHome = () => {
  return (
    <View style={styles.container}>
      
      {/* Rest of your components */}
      <View style={styles.header}>
        <Text style={styles.headerText}>entwyne</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Tell Your</Text>
        <Text style={styles.title}>Love Story</Text>
        <Text style={styles.callout}>
          Together
        </Text>
        <Text style={styles.description}>
          Entwyne is an AI Film Director in your pocket, collaboratively
          collecting stories from engagement to wedding and beyond, preserving
          and sharing the moments that matter the most.
        </Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Try it Now</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>Opens a Demo Experience.</Text>
      </View>
    </View>
  );
};

export default WebMarketingHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the start of the container
  },
  content: {
    flex: 1, // Make the content take up all available space
    alignItems: 'center', // Center items horizontally
    alignSelf: 'stretch', // Stretch items to fill the container horizontally
    paddingTop: '40%', // Push content down by 33%
  },
  header: {
    // Style for header container
  },
  headerText: {
    // Style for the header text
  },

  title: {
    fontSize: 36,
    fontWeight: 'regular',
    textAlign: 'center',
    color: '#424242',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 50,
  },
  footer: {
    paddingBottom: '20%',

  },
  
  callout: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'Oxygen',
    color: '#F55353', // Set the text color
  },
  button: {
    backgroundColor: '#143F6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'grey',
    marginTop: 5,
  },
  // Add styles for the lines
});
