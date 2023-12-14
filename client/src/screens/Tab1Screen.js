// src/screens/Tab1Screen.js
import React, { useContext } from 'react';
import { View, Text, FlatList } from 'react-native';
import { DataContext } from '../utils/dataContext';
import StoryCard from '../components/StoryCard';
import LoadingComponent from '../components/LoadingComponent'; // Import the loading component

const Tab1Screen = () => {
  const { stories } = useContext(DataContext);
  if (stories.length === 0) {
    return <LoadingComponent loadingText="Loading stories..." />;
  }

  return (
    <View>
      <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Your Stories</Text>
      <FlatList
        data={stories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <StoryCard
            title={item.storyName}
            description={item.description || 'No description available'}
          />
        )}
      />
    </View>
  );
};

export default Tab1Screen;
