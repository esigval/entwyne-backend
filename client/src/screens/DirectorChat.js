// DirectorChat.js
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MessageBubble } from '../components/MessageBubble';
import { MessageInput } from '../components/MessageInput';
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_BASE_URL } from '../../config.js';
import { sendMessageToServer } from '../services/chatService.js';
import DesktopWrapper from '../components/DesktopWrapper';

// Mock chat messages
const mockMessages = [
  {
    id: 1,
    text: "To understand your story, I will need to ask a few questions, and at the end we'll move on to the next step to make interviews!",
    isDirector: true,
  },
  {
    id: 2,
    text: "Are you ready to start?",
    isDirector: true,
  },
  // ... additional mock messages
];

const DirectorChat = () => {
  const [selectedValue, setSelectedValue] = useState();
  const [data, setData] = useState([]);
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const storyId = route.params?.storyId;
  const threadId = route.params?.threadId;


  const onSend = async () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        isDirector: false,
      };

      // Update local state with the user's message first
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
      setIsTyping(false);

      // Add a loading placeholder message
      const loadingMessageId = messages.length + 2;
      const loadingMessage = {
        id: loadingMessageId,
        text: '...',
        isDirector: true,
        isLoading: true, // Special property to indicate loading
      };
      setMessages(prevMessages => [...prevMessages, loadingMessage]);

      try {
        // Send the message to the server and wait for the response
        const responseData = await sendMessageToServer(newMessage.text, storyId, data[0].value);
        console.log(responseData);

        if (responseData) {
          const assistantMessage = {
            id: messages.length + 3,
            text: responseData.lastResponse,
            isDirector: true,
          };

          // Replace the loading message with the actual response
          setMessages(prevMessages => prevMessages.map(m => m.id === loadingMessageId ? assistantMessage : m));
        }

        if (responseData.message === 'NavigatetoCapture') {
          navigation.navigate('ProcessingPrompts', { storyId: storyId, mediaType: 'video', threadId: threadId });
        }
      } catch (error) {
        console.error('Error sending message:', error);
        // Remove the loading message or replace it with an error message
        setMessages(prevMessages => prevMessages.filter(m => m.id !== loadingMessageId));
        // Optionally, add an error message to the chat
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${API_BASE_URL}/v1/getTemplate`);
        const transformedData = result.data.map(item => ({
          label: item,
          value: item
        }));
        setData(transformedData);

        // Optionally set the selectedValue to the first item if it exists
        if (transformedData.length > 0) {
          setSelectedValue(transformedData[0]);
        }
      } catch (err) {
        console.error('Failed to fetch templates:', err);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (text) => {
    setInputText(text);
    setIsTyping(text.length > 0);
  };

  const devGoOnPress = () => {
    navigation.navigate('PromptCollection', { storyId: storyId, mediaType: 'video', threadId: threadId });
  };

  const renderStory = async () => {
    try {
      console.log('templateName:', data);
      const response = await axios.post(`${API_BASE_URL}/v1/buildStoryline`, {
        templateName: data[0].value,
        storyId: storyId,
        threadId: threadId,
        mediaType: 'video'
      });

      // handle the response here
      console.log(response.data[0].value);
    } catch (error) {
      console.error('Failed to render story:', error.response ? error.response.data : error);
      // Handle error appropriately
    }
  };

  const scrollViewRef = useRef();

  return (
    <DesktopWrapper>
    <View style={styles.container}>
      <ScrollView
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </ScrollView>
      {/*
  data.length > 0 ? (
    <Picker
      selectedValue={selectedValue}
      style={styles.picker}
      onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
    >
      {data.map((item, index) => (
        <Picker.Item key={index} label={item.label} value={item.value} />
      ))}
    </Picker>
  ) : (
    <Text>Loading templates...</Text> // Or any other placeholder
  )
*/}
      <MessageInput
        inputText={inputText}
        handleInputChange={handleInputChange} // Corrected from onInputChange to handleInputChange
        sendMessage={onSend} // Corrected from onSend to sendMessage
        isTyping={isTyping}
      />
    </View>
    </DesktopWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%',
  },
  messagesContainer: {
    padding: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  goOnButton: {
    alignSelf: 'center',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#007AFF', // Choose your button color
    borderRadius: 20,
  },
  goOnButtonText: {
    color: 'white',
  },
  bubble: {
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '80%',
  },
  directorBubble: {
    backgroundColor: '#E1E3E5',
    alignSelf: 'flex-start',
    marginLeft: 15,
  },
  userBubble: {
    backgroundColor: '#0078FF',
    alignSelf: 'flex-end',
    marginRight: 15,
  },
  text: {
    fontSize: 16,
  },
  tail: {
    position: 'absolute',
    bottom: 0,
    left: -15,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    padding: 15,
    marginRight: 10,
  },
  iconButton: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    left: 10,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
  },
});

export default DirectorChat;
