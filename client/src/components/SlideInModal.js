import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, Animated, TouchableOpacity, StyleSheet } from 'react-native';

const SlideInModal = ({ isVisible, onClose }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current; // Initial position of the modal

  useEffect(() => {
    // This effect toggles the modal's visibility based on the `isVisible` prop
    if (isVisible) {
      triggerOpenModal();
    } else {
      closeModal();
    }
  }, [isVisible]);

  const triggerOpenModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false); // This line will hide the modal
      if (onClose) {
        onClose(); // In case you want to handle something after closing the modal
      }
    });
  };

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType="none"
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Planned Feature: Speak with Your Director</Text>
          <Text style={styles.description}>
            Talking with your director will be easier than ever, with video, audio, text, so that you can easily start creating stories from anywhere!
          </Text>
          <TouchableOpacity onPress={closeModal} style={styles.button}>
            <Text style={styles.buttonText}>Got it</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#424242',
    maxWidth: 700,
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#E0E0E0',
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    color: '#E0E0E0',
  },
  button: {
    backgroundColor: '#143F6B',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});

export default SlideInModal;
