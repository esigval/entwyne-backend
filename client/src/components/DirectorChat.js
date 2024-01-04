// DirectorChat.js
import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_BASE_URL } from '../../config.js';
import { sendMessageToServer } from '../services/chatService.js';

// Mock chat messages
const mockMessages = [
  {
    id: 1,
    text: "To understand your story, I will need to ask a few questions, and you can either take a video, record audio, or text in chat.",
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

      try {
        // Send the message to the server and wait for the response
        const responseData = await sendMessageToServer(newMessage.text, storyId);
        console.log(responseData);

        // Assume responseData contains the assistant's message
        if (responseData) {
          const assistantMessage = {
            id: messages.length + 2, // New ID for the assistant's message
            text: responseData.lastResponse,
            isDirector: true,
          };

          // Update local state with the assistant's response
          setMessages(prevMessages => [...prevMessages, assistantMessage]);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        // Handle the error (e.g., display a notification)
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
        } catch (err) {
            console.error('Failed to fetch templates:', err);
            // Handle error appropriately
        }
    };

    fetchData();
}, []);

  const handleInputChange = (text) => {
    setInputText(text);
    setIsTyping(text.length > 0);
  };

  const devGoOnPress = () => {
    navigation.navigate('TwyneLoadingScreen');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.goOnButton} onPress={devGoOnPress}>
        <Text style={styles.goOnButtonText}>Go On</Text>
      </TouchableOpacity>
      <Picker
        selectedValue={selectedValue}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedValue(itemValue)}
      >
        {data.map((item, index) => (
          <Picker.Item key={index} label={item.label} value={item.value} />
        ))}
      </Picker>
      <MessageInput
        inputText={inputText}
        handleInputChange={handleInputChange} // Corrected from onInputChange to handleInputChange
        sendMessage={onSend} // Corrected from onSend to sendMessage
        isTyping={isTyping}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
