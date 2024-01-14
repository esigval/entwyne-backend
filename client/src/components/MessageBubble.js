import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ChatTail } from "./ChatTail";
import EllipsisLoading from "./EllipsisisLoading";

export const MessageBubble = ({ message }) => {
  return (
    <View style={[styles.bubble, message.isDirector ? styles.directorBubble : styles.userBubble]}>
      {message.isLoading 
        ? <EllipsisLoading />
        : <Text style={styles.text}>{message.text}</Text>
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
  });

