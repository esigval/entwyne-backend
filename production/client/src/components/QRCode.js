import QRCode from 'react-native-qrcode-svg';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ShareYourStoryScreen = ({ route }) => {
    
    const { data } = route.params;
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Scan This Barcode to Share Your Story</Text>
        <QRCode value="https://entwyne.com" size={200} />
        <Text style={styles.title}>Copy This Link to Use Anywhere</Text>
        
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      padding: 30,
    },
    title: {
      fontSize: 22,
      marginBottom: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    // You can add more styles if needed
  });
  
  export default ShareYourStoryScreen;