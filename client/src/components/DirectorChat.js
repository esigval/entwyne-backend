// DirectorChat.js
import React, { useState } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useNavigation } from '@react-navigation/native'

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
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const navigation = useNavigation();

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        isDirector: false,
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      setIsTyping(false);
    }
  };

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
      <MessageInput
        inputText={inputText}
        handleInputChange={handleInputChange} // Corrected from onInputChange to handleInputChange
        sendMessage={sendMessage} // Corrected from onSend to sendMessage
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
