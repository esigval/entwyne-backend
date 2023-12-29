import React, { useContext } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { DataContext } from '../utils/dataContext';
import StoryCard from '../components/StoryCard';
import LoadingComponent from '../components/LoadingComponent';

const Tab1Screen = () => {
  const { stories } = useContext(DataContext);

  // Function to handle 'Create Story' button press
  const handleCreateStoryPress = () => {
    console.log('Create Story button pressed');
    fetch('http://192.168.0.137:3001/v1/createStory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  if (stories.length === 0) {
    return <LoadingComponent loadingText="Loading stories..." />;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
        ListFooterComponent={() => (
          <Button
            title="Create Story"
            onPress={handleCreateStoryPress}
            style={{ marginVertical: 20 }}
          />
        )}
      />
    </View>
  );
};

export default Tab1Screen;
