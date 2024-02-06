import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const SendToButton = ({ promptId, BASE_API_URL, styles }) => {
  const handleSendToPress = () => {
    const url = `${BASE_API_URL}/${promptId}`;
    Clipboard.setString(url);
  };

  return (
    <TouchableOpacity onPress={handleSendToPress} style={styles.buttonStyle}>
      <Text style={styles.buttonText}>Copy Link</Text>
    </TouchableOpacity>
  );
};

export default SendToButton;