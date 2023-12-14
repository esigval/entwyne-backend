import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppHeader from './src/components/AppHeader';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { createStackNavigator } from '@react-navigation/stack';
import CameraCapture from './src/components/CameraCapture.js';
import { DataProvider, DataContext } from './src/utils/dataContext.js';
import TabNavigator from './src/navigation/TabNavigator';

const Stack = createStackNavigator();

const App = () => {
  
  return (
    <DataProvider>
      <ActionSheetProvider>
        <View style={{ flex: 1 }}>
          <AppHeader />
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Home" component={TabNavigator} />
              <Stack.Screen name="CameraCapture" component={CameraCapture} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </ActionSheetProvider>
    </DataProvider>
  );
};

export default App;