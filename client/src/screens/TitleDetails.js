// TitleDetails.js Screen
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Pressable } from 'react-native'; // Add Button here
import { API_BASE_URL } from '../../config';
import { Route } from 'react-native-tab-view';
import axios from 'axios';
import couplePhoto from '../assets/images/CoupleFinished.png';
import { useNavigation } from '@react-navigation/native';

const TitleDetails = ({ route }) => {
  const navigation = useNavigation();
  const [musicName, setMusicName] = useState('');
  const [coupleName, setCoupleName] = useState('');
  const [marriageDate, setMarriageDate] = useState('');

  const { storylineId } = route.params;

  const momentVideo = couplePhoto;
  const promptId = '65a59778e91d4c46ebf40ed6';

  const sendDetails = async () => {

    if (musicName && coupleName && marriageDate) {
      try {
        const response = await axios.post(`${API_BASE_URL}/v1/confirmVideoRender`, {
          storylineId,
          musicName: 'Hopeful.mp3',
          coupleName,
          marriageDate
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log('Please fill all the fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Final Details!</Text>
      <Image
        style={styles.image}
        source={momentVideo}
      />

      <Text style={styles.label}>Couple Name</Text>
      <TextInput
        style={styles.input}
        value={coupleName}
        onChangeText={setCoupleName}
        placeholder="e.g. Alex & Sarah"
        placeholderTextColor="#999" // Light grey
      />

      <Text style={styles.label}>Wedding Date</Text>
      <TextInput
        style={styles.input}
        value={marriageDate}
        onChangeText={setMarriageDate}
        placeholder="e.g. 8/8/2024"
        placeholderTextColor="#999" // Light grey
      />

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => {
            sendDetails();
            navigation.navigate('TwyneLoadingScreen', { storylineId: storylineId });
          }}
        >
          <Text style={styles.buttonText}>Make Twyne!</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    backgroundColor: '#fff',
    position: 'relative',
  },
  image: {
    width: '90%',
    height: 200, // You might want to adjust this
    borderRadius: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#143F6B',
    padding: 15,
    borderRadius: 20,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',

  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '90%',
    position: 'absolute',
    textAlign: 'center',
    bottom: 10, // Position at the bottom of the container
    // Height, backgroundColor, padding, etc. for your button container
  },
});

export default TitleDetails;