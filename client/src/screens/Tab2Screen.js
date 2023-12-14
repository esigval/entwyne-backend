// src/screens/Tab2Screen.js
import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { DataContext } from '../utils/dataContext';
import PromptCard from '../components/PromptCard';

const Tab2Screen = () => {
  const { prompts } = useContext(DataContext);
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

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    headerText: {
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 10,
    },
    contentContainerStyle: {
      paddingBottom: 20,
    },
  });

export default Tab2Screen;

