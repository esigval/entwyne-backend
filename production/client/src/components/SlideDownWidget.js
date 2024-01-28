import React, { useState, useRef } from 'react';
import { View, Text, Animated, PanResponder, StyleSheet } from 'react-native';

const SlideDownWidget = ({ promptDetail }) => {
    const [expanded, setExpanded] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current; // Initial value for slide down
  
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([null, { dy: slideAnim }], { useNativeDriver: false }),
        onPanResponderRelease: () => {
          if (slideAnim._value > 50) {
            // If dragged sufficiently, expand the view
            setExpanded(true);
            Animated.spring(slideAnim, { toValue: 200, useNativeDriver: false }).start();
          } else {
            // Collapse the view
            setExpanded(false);
            Animated.spring(slideAnim, { toValue: 0, useNativeDriver: false }).start();
          }
        },
      })
    ).current;
  
    return (
      <Animated.View
        style={[styles.slideDownContainer, { height: slideAnim.interpolate({
          inputRange: [0, 200],
          outputRange: [50, 250], // Adjust these values as needed
        }) }]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.promptText}>{promptDetail}</Text>
        {expanded && (
          <View>
            <Text style={styles.headerText}>More Info</Text>
            <Text>Filler Text</Text>
            {/* Add more content here */}
          </View>
        )}
      </Animated.View>
    );
  };

  export default SlideDownWidget;
  
  const styles = StyleSheet.create({
    slideDownContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      // Add shadow or border styles as needed
    },
    promptText: {
      fontSize: 18,
      // Add more text styles as needed
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
      // Add more header styles as needed
    },
    // ... other styles ...
  });