import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ChatTail } from "./ChatTail";
import EllipsisLoading from "./EllipsisisLoading";

export const MessageBubble = ({ message }) => {
  return (
    <View style={[styles.bubble, message.isDirector ? styles.directorBubble : styles.userBubble]}>
      {message.isLoading 
        ? <EllipsisLoading />
        : <Text style={message.isDirector ? styles.directorText : styles.userText}>{message.text}</Text>
      }
      {message.isDirector && !message.isLoading}
    </View>
  );
};


  const styles = StyleSheet.create({
    bubble: {
      padding: 15,
      borderRadius: 20,
      marginBottom: 10,
      maxWidth: '80%',
    },
    directorBubble: {
      backgroundColor: '#FFD696',
      alignSelf: 'flex-start',
      marginLeft: 15,
    },
    userBubble: {
      backgroundColor: '#143F6B',
      alignSelf: 'flex-end',
      marginRight: 15,
    },
    text: {
      fontSize: 16,
    },
    directorText: {
      fontSize: 16,
      color: 'black', // Or any color you want for director messages
    },
    userText: {
      fontSize: 16,
      color: 'white', // White color for user messages
    },
  });

