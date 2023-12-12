import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

const CameraComponent = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
    const cameraRef = useRef(null);

    const toggleRecording = async () => {
        if (cameraRef.current) {
            if (isRecording) {
                cameraRef.current.stopRecording();
                setIsRecording(false);
            } else {
                // Additional options can be passed here
                const promise = cameraRef.current.recordAsync();

                if (promise) {
                    setIsRecording(true);
                    const data = await promise;
                    console.log('Video path: ', data.uri);
                    // Handle the video file (e.g., upload to server, play video, etc.)
                }
            }
        }
    };

    const flipCamera = () => {
        setCameraType(
            cameraType === RNCamera.Constants.Type.back
                ? RNCamera.Constants.Type.front
                : RNCamera.Constants.Type.back
        );
    };

    return (
        <View style={styles.container}>
            <RNCamera
                ref={cameraRef}
                style={styles.preview}
                type={cameraType}
                captureAudio={true}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={toggleRecording} style={styles.button}>
                    <Text style={styles.text}>{isRecording ? 'Stop' : 'Record'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={flipCamera} style={styles.button}>
                    <Text style={styles.text}>Flip</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    text: {
        fontSize: 14,
        color: 'black',
    },
});

export default CameraComponent;
