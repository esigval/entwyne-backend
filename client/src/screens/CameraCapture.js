import React, { useState, useEffect, useRef } from 'react';
import { Platform, ScrollView, View, Text, TouchableOpacity, StyleSheet, Animated, PanResponder, PermissionsAndroid } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Icon from 'react-native-vector-icons/Ionicons';
import SlideDownWidget from '../components/SlideDownWidget';
import PromptDrawer from '../components/PromptDrawer';
import { useNavigation } from '@react-navigation/native';

const CameraCapture = ({ route }) => {
    const { promptDetail } = route.params;
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const cameraRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const navigation = useNavigation();


    useEffect(() => {
        (async () => {
            try {
                // Request camera permission
                const cameraPermission = await Camera.requestCameraPermissionsAsync();
                console.log('Camera permission status:', cameraPermission.status);

                // Request media library permission
                const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
                console.log('Media Library permission status:', mediaLibraryPermission.status);

                // Set permission state based on camera and media library permissions
                setHasPermission(cameraPermission.status === 'granted' && mediaLibraryPermission.status === 'granted');
            } catch (error) {
                console.error('Error while requesting permissions:', error);
            }
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const flipCamera = () => {
        setType(
            type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    };
    // Inside your CameraCapture component
    const handleVideoSaved = (videoUri) => {
        navigation.navigate('VideoConfirmation', { videoUri });
    };


    const saveVideoToLibrary = async (videoUri) => {
        try {
            // Check for media library permissions
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need media library permissions to save the video!');
                return;
            }

            // Save the video to the media library
            const asset = await MediaLibrary.createAssetAsync(videoUri);
            console.log('Video saved to Photos', asset);
            // Navigate to the VideoConfirmation screen after the video has been saved
            handleVideoSaved(videoUri);
        } catch (error) {
            console.error('Error saving video to Photos:', error);
        }
    };



    const toggleRecording = async () => {
        if (cameraRef.current) {
            if (isRecording) {
                // Stop the recording
                cameraRef.current.stopRecording(); // This method will stop the recording
                setIsRecording(false); // Update state to reflect that recording has stopped
            } else {
                // Start recording
                setIsRecording(true); // Update state to reflect that recording has started
                cameraRef.current.recordAsync().then(data => {
                    console.log('Recording started');
                    saveVideoToLibrary(data.uri); // Save the video after recording is complete
                    setIsRecording(false); // Update the state after saving the video
                }).catch(error => {
                    console.error('Error during recording:', error);
                    setIsRecording(false); // In case of error, ensure correct state
                });
            }
        }
    };

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type} ref={cameraRef}>
                <View style={styles.promptContainer}>
                    <Text style={styles.promptText}>{promptDetail}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={toggleRecording} style={styles.recordButton}>
                        <Text style={styles.text}>{isRecording ? 'Stop' : 'Record'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={flipCamera} style={styles.flipButton}>
                        <Icon name="repeat-outline" size={30} color="#000" style={styles.flipIcon} />
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    recordButton: {
        backgroundColor: '#ff4040', // Red background for the recording button
        borderRadius: 30,
        padding: 20,
        alignSelf: 'center'
    },
    text: {
        fontSize: 16,
        color: 'white', // White text color
    },
    flipButton: {
        position: 'absolute',
        right: 40,
        backgroundColor: '#fff', // White background for the flip button
        borderRadius: 30,
        padding: 10,
        marginTop: 5 // Adjust this value to position the flip button
    },
    flipText: {
        fontSize: 12,
        color: 'black', // Black text color for flip button
    },
    promptContainer: {
        position: 'absolute',
        top: 10, // Adjust top position as needed
        left: 0,
        right: 0,
        height: 100, // Set a fixed height for the slider
        backgroundColor: '#00000080', // Semi-transparent black background
        padding: 10,
    },
    slide: {
        width: '100%', // Each slide should be the width of the screen
        justifyContent: 'center',
        alignItems: 'center',
    },
    promptText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
    },

});

export default CameraCapture;
