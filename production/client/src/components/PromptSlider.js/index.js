import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { styles } from './styles.js';

const PromptSlider = ({ title, description, onCapture, onToggleOptions, onSendTo, onQRCode, onUpload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleOptions = () => {
    Animated.timing(
      slideAnim,
      {
        toValue: isOpen ? 0 : 1, // Toggle the value between 0 and 1
        duration: 300, // Duration of the slide
        useNativeDriver: false, // Set to true if you're not using width/height in the animations
      }
    ).start();

    setIsOpen(!isOpen);
    if (onToggleOptions) {
      onToggleOptions();
    }
  };

  const cardWidth = 300; // Define the width of the card

  const slideStyle = {
    // Use translateX to slide the view
    transform: [{
      translateX: slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -cardWidth] // Card slides out to the left
      })
    }]
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.cardContainer, slideStyle]}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <TouchableOpacity style={styles.button} onPress={onCapture}>
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleOptions}>
            <Text style={styles.buttonText}>Options</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.options, { width: cardWidth }]}>
          <TouchableOpacity onPress={onSendTo}>
            <Text>Send to</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onQRCode}>
            <Text>QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onUpload}>
            <Text>Upload</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default PromptSlider;