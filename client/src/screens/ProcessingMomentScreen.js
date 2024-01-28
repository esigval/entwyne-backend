import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../config.js';
import { useNavigation } from '@react-navigation/native'
import FadeInView from '../components/FadeInView.js';
import DesktopWrapper from '../components/DesktopWrapper';


// Usage in your app
const ProcessingMomentComponent = ({route}) => {

  const [currentCheck, setCurrentCheck] = useState('Checking Video');
  const [loadingAnim] = useState(new Animated.Value(0));  // Initial value f7or width: 0
  const [data, setData] = useState(null);  // State variable to store the data from the endpoint

  const navigation = useNavigation();
  const { storyId, newTwyneId, promptDetail, promptId } = route.params;

  /* test block const newTwyneId = '65a59784e91d4c46ebf40ed8';
  const promptId = '65a59778e91d4c46ebf40ed6';
  const promptDetail = 'Reflect on the first thing that attracted you to your partner. Share that initial spark with us!';
  const storyId = '65a596f6e91d4c46ebf40ed4';*/

  const hasNavigated = useRef(false);
  
  console.log('newTwyneId:', newTwyneId);

  useEffect(() => {
    // Change the checking text every second
    const interval = setInterval(() => {
      setCurrentCheck((prevCheck) => {
        if (prevCheck === 'Checking Video') return 'Checking Audio';
        if (prevCheck === 'Checking Audio') return 'Checking Message';
        return 'Checking Video';
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
        duration: 15000,  // Duration of the animation
        useNativeDriver: false,
      }
    ).start();
  }, [loadingAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      const fetchData = async () => {
        console.log('newTwyneId Right before Call:', newTwyneId); // Log newTwyneId
        try {
          const result = await axios.get(`${API_BASE_URL}/v1/checkMomentProcess?newTwyneId=${newTwyneId}&storyId=${storyId}&prompts=${promptDetail}`);
          setData(result.data);
        } catch (error) {
          console.error(error);
        }
      };
  
      if (hasNavigated.current) {
        clearInterval(interval);
      } else {
        fetchData();
      }
    }, 4000);  // Interval set to 5 seconds
  
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);
  

  useEffect(() => {
    if (data) {
      // Navigate to the new screen when data is set
      // Replace 'NewScreenName' with the actual name of the screen you want to navigate to
      navigation.navigate('DirectorReview', { data, storyId, newTwyneId, promptDetail, promptId });
      hasNavigated.current = true;
    }
  }, [data, navigation]);

  return (
    <DesktopWrapper>
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Animated.View style={[styles.loadingBar, { width: loadingAnim }]} />
        <FadeInView style={styles.fadeView}>
          <Text style={styles.header}>Processing Moment</Text>
        </FadeInView>
      </View>
      <View style={styles.contentContainer}>
        <FadeInView style={styles.fadeView}>
          <Text style={styles.standardText}>Let’s Review Your Moment to Make Sure It Looks and Sounds Great</Text>
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
    marginTop: 100,
    textAlign: 'center',
    fontSize: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    color: '#FFF',
  },
  standardText: {
    fontSize: 36,
    color: '#FFF',
    textAlign: 'center',
  },

});



export default ProcessingMomentComponent;
