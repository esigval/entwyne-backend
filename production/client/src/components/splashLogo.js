import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Logo from '../assets/etnwyneLogo.svg'; // Import your SVG logo

const EntwyneSplash = () => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    SplashScreen.hide();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.logoContainer, opacity: fadeAnim }}>
        <Logo width={200} height={200} />
      </Animated.View>
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
  logoContainer: {
    // additional styling if needed
  }
});

export default EntwyneSplash;
