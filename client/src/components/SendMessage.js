// SendMessage.js
import React from 'react';
import { View, TextInput, Button } from 'react-native';

const SendMessage = ({ inputText, handleInputChange, onSend }) => {
  return (
    <View>
      <TextInput
        value={inputText}
        onChangeText={handleInputChange}
        // Add other props as needed
      />
      <Button title="Send" onPress={onSend} />
    </View>
  );
};

export default SendMessage;
