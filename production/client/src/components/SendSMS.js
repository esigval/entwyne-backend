import React from 'react';
import { View, Button, Platform, Linking, Alert, StyleSheet } from 'react-native';

const SendSMS = ({ message, recipients }) => {
  const handleSendTextMessage = async () => {
    // Construct the SMS URL
    let smsUrl = `sms:${recipients ? recipients.join(',') : ''}`;
    if (Platform.OS === 'android') {
      smsUrl += `?body=${encodeURIComponent(message)}`;
    } else {
      // For iOS, add the & at the end of the body
      smsUrl += `&body=${encodeURIComponent(message)}`;
    }

    // Check if the device can handle the URL
    const canOpen = await Linking.canOpenURL(smsUrl);
    if (canOpen) {
      Linking.openURL(smsUrl).catch((error) => {
        Alert.alert('Error', 'An error occurred trying to send the message.');
        console.error('An error occurred', error);
      });
    } else {
      Alert.alert('Error', 'Unable to send text message.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Send Text Message" onPress={handleSendTextMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Add your styling for the container
  },
});

export default SendSMS;
