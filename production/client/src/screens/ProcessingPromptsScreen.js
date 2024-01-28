import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../config.js';
import { useNavigation } from '@react-navigation/native'
import FadeInView from '../components/FadeInView.js';
import DesktopWrapper from '../components/DesktopWrapper';


// Usage in your app
const creatingStoryLoadingComponent = ({route}) => {

  const [currentCheck, setCurrentCheck] = useState('Finding Themes');
  const [loadingAnim] = useState(new Animated.Value(0));  // Initial value f7or width: 0
  const [data, setData] = useState(null);  // State variable to store the data from the endpoint

  const navigation = useNavigation();
  const { storyId, threadId, mediaType } = route.params;


  const hasNavigated = useRef(false);

  useEffect(() => {
    // Change the checking text every second
    const interval = setInterval(() => {
      setCurrentCheck((prevCheck) => {
        if (prevCheck === 'Creating Prompts') return 'Reviewing Story';
        if (prevCheck === 'Reviewing Story') return 'Building Storyline';
        return 'Creating Prompts';
      });
    }, 2000); // Interval set to 2 second

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.timing(
      loadingAnim,
      {
        toValue: Dimensions.get('window').width,  // Animate to full width of the screen
        duration: 5000,  // Duration of the animation
        useNativeDriver: false,
      }
    ).start();
  }, [loadingAnim]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${API_BASE_URL}/v1/checkPromptLoading`, {
          params: {
            storyId: storyId,
            mediaType: mediaType,
          }
        });
        setData(result.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    const interval = setInterval(() => {
      if (!hasNavigated.current) {
        fetchData();
      }
    }, 4000);  // Interval set to 4 seconds
  
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [storyId, mediaType, hasNavigated]); // Include all dependencies here
  
  

  useEffect(() => {
    if (data) {
      // Navigate to the new screen when data is set
      // Replace 'NewScreenName' with the actual name of the screen you want to navigate to
      navigation.navigate('PromptCollection', { storyId: storyId, mediaType: 'video', threadId: threadId});
      hasNavigated.current = true;
    }
  }, [data, navigation]);

  return (
    <DesktopWrapper>
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Animated.View style={[styles.loadingBar, { width: loadingAnim }]} />
        <FadeInView style={styles.fadeView}>
          <Text style={styles.header}>Creating Interview Questions</Text>
        </FadeInView>
      </View>
      <View style={styles.contentContainer}>
        <FadeInView style={styles.fadeView}>
          <Text style={styles.standardText}>One Moment While We Assemble Our Interviews</Text>
        </FadeInView>
        <Text style={styles.checkingText}>{currentCheck}</Text>
      </View>
    </View>
    </DesktopWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 50,
  },
  contentContainer: {
    flex: 7,
    justifyContent: 'flex-start',
    textAlign: 'center',
    padding: 60,
  },
  loadingBar: {
    height: 10,
    backgroundColor: '#143F6B',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  fadeView: {
    padding: 20,
  },
  checkingText: {
    marginTop: 80,
    textAlign: 'center',
    fontSize: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
  },
  standardText: {
    fontSize: 36,
    color: '#E0E0E0',
    textAlign: 'center',
  },

});



export default creatingStoryLoadingComponent;
