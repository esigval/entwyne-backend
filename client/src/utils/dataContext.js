// DataContext.js
import React, { createContext, useState, useEffect } from 'react';
import { fetchStories, fetchPrompts } from './dataFetch';
import * as SplashScreen from 'expo-splash-screen';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [stories, setStories] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);


  useEffect(() => {
    async function prepare() {
      try {
        const storiesData = await fetchStories();
        const promptsData = await fetchPrompts();

        setStories(storiesData);
        setPrompts(promptsData);
      } catch (e) {
        console.warn(e);
      } finally {
        setIsDataLoaded(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isDataLoaded]);

  return (
    <DataContext.Provider value={{ stories, setStories, prompts, setPrompts }}>
      {children}
    </DataContext.Provider>
  );
};
