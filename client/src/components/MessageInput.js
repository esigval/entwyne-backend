import React, { useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SlideInModal from './SlideInModal';

export const MessageInput = ({
  inputText,
  handleInputChange,
  sendMessage,
  isTyping,
  onCameraPress,
  onMicPress,
  directorResponded,
  resetDirectorResponded
}) => {
  const textInputRef = useRef(null);

  useEffect(() => {
    // Automatically focus the TextInput when the component mounts and
    // whenever it re-renders, which might be triggered by parent state changes.
    const focusTextInput = () => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    };

    focusTextInput();

    // Optionally, you can listen to events that may cause the input to lose focus and refocus
    // const onBlurListener = () => focusTextInput();
    // textInputRef.current.addEventListener('blur', onBlurListener);
    // return () => textInputRef.current.removeEventListener('blur', onBlurListener);

  }, []);

  return (
    <View style={styles.inputArea}>
      <TextInput
        style={styles.textInput}
        value={inputText}
        onChangeText={handleInputChange}
        placeholder="Message..."
        onSubmitEditing={sendMessage}
        numberOfLines={2} // Set initial number of lines
      />
      {isTyping ? (
        <TouchableOpacity onPress={sendMessage} style={styles.iconButton}>
          <Icon name="ios-send" size={30} color="#000" />
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity onPress={onCameraPress} style={styles.iconButton}>
            <Icon name="ios-camera" size={30} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onMicPress} style={styles.iconButton}>
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
    // Add height: undefined and maxHeight to allow for expansion
    height: undefined,
    maxHeight: 120, //
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