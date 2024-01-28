import { Animated } from 'react-native';

const fadeIn = (fadeAnim) => {
    return Animated.timing(fadeAnim, {
      toValue: 1, // Target opacity value for fade in
      duration: 500, // Duration of fade in
      useNativeDriver: true,
    });
  };
  
  const fadeOut = (fadeAnim) => {
    return Animated.timing(fadeAnim, {
      toValue: 0, // Target opacity value for fade out
      duration: 500, // Duration of fade out
      useNativeDriver: true,
    });
  };
  
  const fadeTransition = (fadeAnim) => {
    Animated.sequence([
      fadeOut(),
      fadeIn(),
    ]).start();
  };

  export { fadeIn, fadeOut, fadeTransition };

