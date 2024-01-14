import React, { useEffect, useState, useRef } from 'react';
import { View, Button, Text, StyleSheet, Pressable } from 'react-native';
import uploadVideoToS3 from '../functions/uploadVideoToS3';
import { useNavigation } from '@react-navigation/native'

const WebCamera = ({ route }) => {
    const navigation = useNavigation();
    const timerDuration = 30
    const { promptDetail, promptId, storyId } = route.params;

    const [stream, setStream] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [recordedVideoURL, setRecordedVideoURL] = useState(null);
    const [playbackMode, setPlaybackMode] = useState(false);
    const [timerValue, setTimerValue] = useState(timerDuration);
    const [timer, setTimer] = useState(10 * 30);

    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const playbackVideoRef = useRef(null);
    const timerRef = useRef(null);





    const enableStream = async () => {
        if (typeof navigator.mediaDevices.getUserMedia === 'function') {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(newStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;
                }
            } catch (err) {
                console.error(err);
            }
        }
    };


    const handleStartRecording = () => {
        if (!isRecording) {
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = handleDataAvailable;
            mediaRecorderRef.current.start();
            setRecordedChunks([]);
            setIsRecording(true);
            setPlaybackMode(false);
        }
        timerRef.current = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 1) {
                    clearInterval(timerRef.current);
                    handleStopRecording(); // Automatically stop recording when time is up
                }
                const seconds = Math.floor(prevTimer / 10);
                const milliseconds = (prevTimer % 10) * 10; // Multiply by 100 because we're counting down every 100ms
                const tenthsOfSecond = Math.floor(milliseconds / 10);
                const timerString = `${seconds}:${tenthsOfSecond < 10 ? '0' : ''}${tenthsOfSecond}`;
                setTimerValue(timerString); // Update the timerValue state variable
                return prevTimer - 1;
            });
        }, 100);
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    const handleDataAvailable = ({ data }) => {
        if (data.size > 0) {
            setRecordedChunks(prevChunks => [...prevChunks, data]);
        }
    };

    const handleSaveVideo = () => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            console.log('Recording finished, URL:', url); // Debug log
            setRecordedVideoURL(url);
            setPlaybackMode(true); // Switch to playback mode
            setRecordedChunks([]);
        }
    };

    const handleDownloadVideo = () => {
        if (recordedVideoURL) {
            // Create an anchor element and trigger download
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            a.href = recordedVideoURL;
            a.download = 'recordedVideo.webm'; // Set the file name for download
            a.click();
            window.URL.revokeObjectURL(recordedVideoURL);
            document.body.removeChild(a);
        }
    };

    const handleSend = async () => {
        if (recordedVideoURL) {
            try {
                // Convert the blob URL to a blob
                const response = await fetch(recordedVideoURL);
                const blob = await response.blob();
                console.log('Blob created from recordedVideoURL:', blob)
                // Create a file-like object from the blob
                const file = new File([blob], `testfile`, { type: 'video/webm' });
                const videoType = file.type;

                // Call your upload function
                const newTwyneId = await uploadVideoToS3(file, promptId, videoType);
                console.log('newTwyneId:', newTwyneId);
                console.log('Video uploaded successfully');

                // Navigate to the 'PromptCollection' screen with parameters
                navigation.navigate('ProcessingMoment', { storyId: storyId, newTwyneId: newTwyneId, promptDetail: promptDetail, promptId: promptId });
            } catch (error) {
                console.error('Error in uploading video:', error);
            }
        }
    };

    useEffect(() => {
        if (!stream) {
            enableStream();
        } else {
            // Cleanup function
            return () => {
                stream.getTracks().forEach(track => track.stop());
            };
        }
    }, [stream]);

    useEffect(() => {
        if (route.params?.fromScreen === 'DirectorReview') {
            handleRerecord();
        }
    }, [route.params]);

    useEffect(() => {

        if (!isRecording && recordedChunks.length > 0 && !playbackMode) {
            // All chunks are received, now we can transition to playback mode
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setRecordedVideoURL(url);
            setPlaybackMode(true);
            setRecordedChunks([]); // Clear the chunks for the next recording
        }
    }, [isRecording, recordedChunks, playbackMode]);

    const handleRerecord = () => {
        // Stop any active tracks in the stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setStream(null);
        setRecordedVideoURL(null);
        setPlaybackMode(false);
        setRecordedChunks([]);

        enableStream(); // Re-initialize the stream

        // Reset the timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setTimerValue(timerDuration); // Reset the timer display value
        setTimer(timerDuration * 10); // Reset the timer to the initial duration

    };



    return (
        <View style={styles.container}>
            {/* Prompt Container */}
            <View style={styles.promptContainer}>
                <Text style={styles.promptText}>{promptDetail}</Text>
            </View>

            {/* Timer */}
            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{timerValue}</Text>
            </View>
            {!playbackMode && (
                <View style={styles.cameraContainer}>
                    <video ref={videoRef} autoPlay playsInline muted style={styles.video} />
                    <View style={styles.buttonContainer}>
                        {isRecording ? (
                            <Pressable style={styles.button} onPress={handleStopRecording}>
                                <Text style={styles.buttonText}>Stop Recording</Text>
                            </Pressable>
                        ) : (
                            <Pressable style={styles.button} onPress={handleStartRecording}>
                                <Text style={styles.buttonText}>Start Recording</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            )}

            {playbackMode && (
                <View style={styles.playbackContainer}>
                    <video ref={playbackVideoRef} src={recordedVideoURL} style={styles.video} controls />
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.button} onPress={handleSend}>
                            <Text style={styles.buttonText}>Send</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={handleRerecord}>
                            <Text style={styles.buttonText}>ReRecord</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={handleDownloadVideo}>
                            <Text style={styles.buttonText}>Download</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    video: {
        width: 400,
        height: 300
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginTop: 20,
        width: '100%',

    },
    button: {
        width: '100%', // This will make the button itself full width
        backgroundColor: '#007BFF', // This will set the button color
        padding: 10, // This will set the padding inside the button
        alignItems: 'center', // This will center the text inside the button
        borderRadius: 5, // This will round the corners of the button
        justifyContent: 'center', // This will center the text vertically
        marginTop: 10, // This will give the button margin from the top
    },
    buttonText: {
        color: '#FFFFFF', // This will set the button text color
        fontSize: 16, // This will set the button text size
    },
    promptContainer: {
        padding: 10,
        backgroundColor: '#eee',
        borderRadius: 5,
        marginBottom: 10,
    },
    promptText: {
        fontSize: 16,
        textAlign: 'center',
    },
    timerContainer: {
        marginBottom: 10,
    },
    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default WebCamera