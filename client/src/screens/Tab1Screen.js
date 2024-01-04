import React, { useContext, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { DataContext } from '../utils/dataContext';
import StoryCard from '../components/StoryCard';
import PlaceholderStoryCard from '../components/PlaceholderStoryCard'; // Import your PlaceholderStoryCard
import { API_BASE_URL } from '../../config.js';


const Tab1Screen = () => {
  const { stories, setStories } = useContext(DataContext);
  const [isCreating, setCreating] = useState(false);

  const handleCreateStoryPress = () => {
    setCreating(true); // Start creating a new story
    fetch(`${API_BASE_URL}/v1/createStory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setCreating(false); // Stop creating
        setStories([...stories, data.savedStory]); // Update the stories list with the new story
      })
      .catch((error) => {
        console.error('Error:', error);
        setCreating(false); // Stop creating in case of error
      });
  };

  const handleDeleteStory = (id) => {
    fetch(`${API_BASE_URL}/v1/deleteStory/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        setStories(stories.filter(story => story._id !== id)); // Update state to reflect deletion
      } else {
        // Handle error response
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const renderStory = ({ item }) => {
    if (item.loading) {
      return <PlaceholderStoryCard />;
    }
    return <StoryCard title={item.storyName} description={item.description || 'No description available'} onDeletePress={handleDeleteStory}
    id={item._id}/>;
  };

  const dataWithPlaceholder = isCreating ? [...stories, { loading: true }] : stories;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Your Stories</Text>
      <FlatList
        data={dataWithPlaceholder}
        keyExtractor={(item) => item._id || 'placeholder'}
        renderItem={renderStory}
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
