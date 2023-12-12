import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppHeader from './src/components/AppHeader';
import StoryCard from './src/components/StoryCard';
import PromptSlider from './src/components/PromptSlider.js';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import PromptCard from './src/components/PromptCard.js';
import TwyneGrid from './src/components/TwyneGrid.js';
import axios from 'axios';
import { createStackNavigator } from '@react-navigation/stack';
import CameraComponent from './src/components/cameraCapture.js';

// Define your screens
const Tab1Screen = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    // Function to fetch stories from your API
    const fetchStories = async () => {r
      try {
        const response = await axios.get('http:/192.168.0.137:3001/v1/stories');
        console.log(response.data);
        setStories(response.data); // Set the stories in state
      } catch (error) {
        console.error('Error fetching stories:', error);
        alert(`Error: ${error.message}`);
      }
    };

    fetchStories();
  }, []); // The empty array ensures this effect runs only once after the component mounts
  <Text>{JSON.stringify(stories, null, 2)}</Text>
  console.log(stories);
  console.log(stories);
  return (
    <View>
      <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Your Stories</Text>
      <FlatList
        data={stories}
        keyExtractor={(item) => item._id} // Assuming each story has a unique _id
        renderItem={({ item }) => (
          <StoryCard
            title={item.storyName} // Use the 'storyName' field as the title
            description={item.description || 'No description available'} // Use a 'description' field if available
          />
        )}
      />
    </View>
  );
};

const Tab2Screen = () => {
  // Define the onRequestTwyne callback
  const [prompts, setPrompts] = useState([]);
  
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await axios.get('http://192.168.0.137:3001/v1/prompts');
        console.log(response.data);
        setPrompts(response.data); // Set the prompts in state
      } catch (error) {
        console.error('Error fetching prompts:', error);
        alert(`Error: ${error.message}`);
      }
    };

    fetchPrompts();
  }, []);
  
  const onRequestTwyne = (title) => {
    const options = ['Send Text Message', 'Create QR Code', 'Create Link', 'Cancel'];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log(`Send Text Message for ${title}`);
            break;
          case 1:
            console.log(`Create QR Code for ${title}`);
            break;
          case 2:
            console.log(`Create Link for ${title}`);
            break;
        }
      }
    );
  };

  const toggleOptionsFunction = (title) => {
  };

  // Define the onUpload and onEdit callbacks
  const onUpload = (title) => {
    // Handle the upload functionality here
    console.log(`Upload content for ${title}`);
  };

  const onEdit = (title) => {
    // Handle the edit functionality here
    console.log(`Edit content for ${title}`);
  };
  const sendToFunction = (title) => {
    console.log(`Send to ${title}`);
  };
  const qrCodeFunction = (title) => {
    console.log(`QR Code for ${title}`);
  };
  const uploadFunction = (title) => {
    console.log(`Upload ${title}`);
  };


  return (
    <View style={styles.scrollViewStyle} contentContainerStyle={styles.contentContainerStyle}>
      
      <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Prompts</Text>
      <FlatList
        data={prompts}
        keyExtractor={(item) => item._id} // Assuming each prompt has a unique _id
        renderItem={({ item }) => (
          <PromptCard
            title={item.promptTitle} // Use the 'promptTitle' field as the title
            description={item.prompt} // Use the 'prompt' field as the description
            onRequestTwyne={onRequestTwyne}
            onUpload={uploadFunction}
            onEdit={onEdit}
          />
        )}
      />
      {/* Render more PromptCards as needed */}
    </View>
  );
};

const Tab3Screen = () => {
  return (
    <View style={{ flex: 1 }}>
      <TwyneGrid />
    </View>
  );
};

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Stories" component={Tab1Screen} />
      <Tab.Screen name="Prompts" component={Tab2Screen} />
      <Tab.Screen name="Twynes" component={Tab3Screen} />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <ActionSheetProvider>
      <View style={{ flex: 1 }}>
        <AppHeader />
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={TabNavigator} />
            <Stack.Screen name="CameraCapture" component={CameraComponent} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </ActionSheetProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollViewStyle: {
    // Styles for the ScrollView itself
    // e.g., backgroundColor, padding, etc.
  },
  contentContainerStyle: {
    // Styles for the content container
    // e.g., alignItems, justifyContent
    justifyContent: 'flex-start', // or 'center', depending on your layout
  },
  headerText: {
    alignItems: 'center',
  },
});
