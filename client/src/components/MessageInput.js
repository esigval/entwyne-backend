import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const MessageInput = ({ inputText, handleInputChange, sendMessage, isTyping }) => {
    return (
      <View style={styles.inputArea}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={handleInputChange}
          placeholder="Message..."
          onSubmitEditing={sendMessage}
        />
        {isTyping ? (
          <TouchableOpacity onPress={sendMessage} style={styles.iconButton}>
            <Icon name="ios-send" size={30} color="#000" />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="ios-camera" size={30} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="ios-mic" size={30} color="#000" />
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
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
  });