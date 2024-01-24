import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import DesktopWrapper from './src/components/DesktopWrapper';
import { NavigationContainer } from '@react-navigation/native';
import AppHeader from './src/components/AppHeader';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { createStackNavigator } from '@react-navigation/stack';
import CameraCapture from './src/screens/CameraCapture';
import { DataProvider, DataContext } from './src/utils/dataContext.js';
import TabNavigator from './src/navigation/TabNavigator';
import ShareYourStoryScreen from './src/components/QRCode.js';
import VideoConfirmationScreen from './src/screens/VideoConfirmationScreen.js';
import FullScreenMediaScreen from './src/screens/FullScreenMediaPlayer.js';
import WebMarketingHome from './src/components/webMarketing.js';
import DirectorChat from './src/screens/DirectorChat';
import TwyneLoadingScreen from './src/screens/TwyneLoadingScreen';
import ErrorBoundary from './src/utils/ErrorBoundary.js';
import DeliverTwyne from './src/screens/DeliverTwyne.js';
import PromptCollectionScreen from './src/screens/PromptCollection.js';
import ProcessingMomentComponent from './src/screens/ProcessingMomentScreen';
import DirectorReview from './src/screens/DirectorMomentReviewScreen.js';
import PhotoUpload from './src/screens/PhotoUpload.js';
import ProcessingPromptsScreen from './src/screens/ProcessingPromptsScreen';
import TitleDetails from './src/screens/TitleDetails.js';



const Stack = createStackNavigator();

// Define a standard set of screen options
const defaultScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: { animation: 'timing', config: { duration: 500 } },
    close: { animation: 'timing', config: { duration: 500 } }
  },
};

const App = () => {

  return (
    <ErrorBoundary>
      <DataProvider>
        <ActionSheetProvider>
          <View style={{ flex: 1 }}>
            <AppHeader />
            <NavigationContainer>
              <Stack.Navigator>
              <Stack.Screen name="DirectorReview" component={DirectorReview} options={{ headerShown: false }} />
              <Stack.Screen name="PhotoUpload" component={PhotoUpload} options={defaultScreenOptions} />
              
                <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="CameraCapture" component={CameraCapture} options={{ headerShown: false }} />
                <Stack.Screen name="ProcessingMoment" component={ProcessingMomentComponent} options={{ headerShown: false }} />
                <Stack.Screen name="DeliverTwyne" component={DeliverTwyne} options={{ headerShown: false }} />
                <Stack.Screen name="TitleDetails" component={TitleDetails} options={{ headerShown: false }} />
                <Stack.Screen name="ProcessingPrompts" component={ProcessingPromptsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Marketing" component={WebMarketingHome} options={{ headerShown: false }} />
                <Stack.Screen name="TwyneLoadingScreen" component={TwyneLoadingScreen} options={{ headerShown: false }} />
                <Stack.Screen name="DirectorChat" component={DirectorChat} options={{ headerShown: false }} />
                <Stack.Screen name="ShareYourStoryScreen" component={ShareYourStoryScreen} />
                <Stack.Screen name="VideoConfirmation" component={VideoConfirmationScreen} options={{ headerShown: false }} />
                <Stack.Screen name="FullScreenMediaScreen" component={FullScreenMediaScreen} />
                <Stack.Screen name="PromptCollection" component={PromptCollectionScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </ActionSheetProvider>
      </DataProvider>
    </ErrorBoundary>
  );
};


export default App;