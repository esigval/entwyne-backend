import React, { createContext, useState, useEffect } from 'react';
import { fetchStories, fetchPrompts, fetchTwynes } from './dataFetch';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [stories, setStories] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [twynes, setTwynes] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadResourcesAndData = async () => {
    try {
      await SplashScreen.preventAutoHideAsync();

      // Load fonts
      await Font.loadAsync({
        'Oxygen': require('../assets/fonts/Oxygen-Regular.ttf'),
        // ... other fonts as needed
      });
      setFontsLoaded(true); // Set font loaded state

      // Fetch data
      const [storiesData, promptsData, twynesData] = await Promise.all([
        fetchStories(),
        fetchPrompts(),
        fetchTwynes(),
      ]);

      setStories(storiesData);
      setPrompts(promptsData);
      setTwynes(twynesData);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsDataLoaded(true);
    }
  };

  useEffect(() => {
    loadResourcesAndData();
  }, []);

  useEffect(() => {
    if (isDataLoaded && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isDataLoaded, fontsLoaded]);

  // Refresh the data when needed
  const refreshData = async () => {
    setIsDataLoaded(false); // Set data as not loaded
    await fetchData(); // Fetch data again
  };

  // Define the context provider value
  const contextValue = {
    stories,
    setStories,
    prompts,
    setPrompts,
    twynes,
    setTwynes,
    refreshData,
  };

  // Render the children within the DataContext.Provider
  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
