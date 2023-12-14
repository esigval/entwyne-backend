import React, { useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import AnimatedLogo from '../assets/etnwyneLogo'; // Your animated logo component

const AnimatedSplashScreen = ({ onAnimationEnd }) => {
  useEffect(() => {
    // Start your animation here
    // Once the animation is done, call onAnimationEnd
    onAnimationEnd();
  }, []);

  // Render your animated components
  return (
    <View style={styles.container}>
      <AnimatedLogo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});

export default AnimatedSplashScreen;
