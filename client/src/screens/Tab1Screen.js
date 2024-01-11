import React, { useContext, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { DataContext } from '../utils/dataContext';
import StoryCard from '../components/StoryCard';
import PlaceholderStoryCard from '../components/PlaceholderStoryCard'; // Import your PlaceholderStoryCard
import { API_BASE_URL } from '../../config.js';


const Tab1Screen = () => {
  const { stories, setStories, refreshData } = useContext(DataContext);
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
      if (data && data.updatedStory) {
        // Assuming updatedStory is the correct property based on your screenshot
        setStories(prevStories => [...prevStories, data.updatedStory]);
        // If refreshData() is used to refresh the list from the server, it might not be needed here.
        // Only use it if you want to re-fetch all stories.
        // refreshData(); 
      } else {
        // Handle any case where the response may not be what you expect
        console.error('New story was not returned correctly from the server', data);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      setCreating(false); // Stop creating in case of error
    });
  };
  

  const handleDeleteStory = (id, threadId) => {
    fetch(`${API_BASE_URL}/v1/deleteStory/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        threadId: threadId,

      }),
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
    id={item._id} threadId={item.threadId}/>;
  };

  const dataWithPlaceholder = isCreating ? [...stories, { loading: true }] : stories;
  console.log("Stories:", stories);

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
