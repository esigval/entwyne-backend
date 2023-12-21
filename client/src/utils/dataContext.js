import React, { createContext, useState, useEffect } from 'react';
import { fetchStories, fetchPrompts, fetchTwynes } from './dataFetch';
import * as SplashScreen from 'expo-splash-screen';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [stories, setStories] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [twynes, setTwynes] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const fetchData = async () => {
    try {
      const [storiesData, promptsData, twynesData] = await Promise.all([
        fetchStories(),
        fetchPrompts(),
        fetchTwynes()
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
    fetchData();
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isDataLoaded]);

  const refreshData = async () => {
    setIsDataLoaded(false);
    await fetchData();
  };

  return (
    <DataContext.Provider value={{ stories, setStories, prompts, setPrompts, twynes, setTwynes, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};
