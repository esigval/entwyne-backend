import React, { useState, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure to add this dependency

const SlidingDrawer = ({ promptDetail }) => {
  const [expanded, setExpanded] = useState(false);
  const drawerHeight = useRef(new Animated.Value(0)).current;

  // Function to toggle drawer
  const toggleDrawer = () => {
    setExpanded(!expanded);
    Animated.timing(drawerHeight, {
      toValue: expanded ? 0 : 1, // 0 is closed, 1 is open
      duration: 300, // milliseconds
      useNativeDriver: false, // height does not support native driver
    }).start();
  };

  // Set up the drawer height interpolation
  const drawerStyle = {
    height: drawerHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 200], // Adjust these numbers to match your drawer's min and max height
    }),
  };

  return (
    <Animated.View style={[styles.drawerContainer, drawerStyle]}>
      <TouchableOpacity style={styles.drawerHandle} onPress={toggleDrawer}>
        <Icon name="ios-menu" size={30} color="#333" />
      </TouchableOpacity>
      <Text style={styles.promptText}>{promptDetail}</Text>
      {/* Additional content when expanded */}
      {expanded && (
        <View>
          <Text style={styles.headerText}>Story Context:</Text>
          <Text style={styles.detailText}>we're focusing on the cave adventure part of sigvaldsen thanksgiving.</Text>
          <Text style={styles.headerText}>Shot Detail:</Text>
          <Text style={styles.detailText}>this should be an interview. look at the camera, and answer the question.</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden', // Hide the content when the drawer is retracted
  },
  drawerHandle: {
    padding: 10, // Padding for the touchable area
    alignSelf: 'center', // Center the drawer handle horizontally
  },
  promptText: {
    fontSize: 18,
    textAlign: 'center',
    // Add more styling as needed
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    // Add more styling as needed
  },
  detailText: {
    fontSize: 14,
    // Add more styling as needed
  },
  // ... other styles ...
});

export default SlidingDrawer;
