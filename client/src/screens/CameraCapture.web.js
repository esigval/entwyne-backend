import React, { useEffect, useState, useRef } from 'react';
import { View, Button, Text, StyleSheet, Pressable, ActivityIndicator, Android, Animated, Platform } from 'react-native';
import uploadVideoToS3 from '../functions/uploadVideoToS3';
import { useNavigation } from '@react-navigation/native'
import DesktopWrapper from '../components/DesktopWrapper';


const WebCamera = ({ route }) => {
    const navigation = useNavigation();
    const timerDuration = 30
    const { promptDetail, promptId, storyId, primers } = route.params;
    // const promptDetail = 'Tell us a little bit more about your trip to Paris';
    // Initialize an Animated Value


    const [stream, setStream] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isContinueLoading, setIsContinueLoading] = useState(false);
    const [isRedoLoading, setIsRedoLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [recordedVideoURL, setRecordedVideoURL] = useState(null);
    const [playbackMode, setPlaybackMode] = useState(false);
    const [timerValue, setTimerValue] = useState(timerDuration);
    const [isInitiatingRecording, setIsInitiatingRecording] = useState(false);
    const [timer, setTimer] = useState(30);
    const [countdown, setCountdown] = useState(3);
    const [fadeAnim] = useState(new Animated.Value(1)); // Initial value for opacity: 0
    const [tagColors, setTagColors] = useState({});

    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const playbackVideoRef = useRef(null);
    const timerRef = useRef(null);
    const animatedWidth = useRef(new Animated.Value(100)).current; // 100% width initially



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

    useEffect(() => {
        const newTagColors = {};
        primers.forEach((primer, index) => {
            newTagColors[primer] = colors[Math.floor(Math.random() * colors.length)];
        });
        setTagColors(newTagColors);
    }, [primers]); // Depend on `primers` to update when it changes

    const fadeIn = () => {
        return Animated.timing(fadeAnim, {
            toValue: 1, // Target opacity value for fade in
            duration: 500, // Duration of fade in
            useNativeDriver: true,
        });
    };

    const fadeOut = () => {
        return Animated.timing(fadeAnim, {
            toValue: 0, // Target opacity value for fade out
            duration: 500, // Duration of fade out
            useNativeDriver: true,
        });
    };

    const fadeTransition = () => {
        Animated.sequence([
            fadeOut(),
            fadeIn(),
        ]).start();
    };

    const startAnimation = () => {
        Animated.timing(animatedWidth, {
            toValue: 0, // Animate to 0% width
            duration: timerDuration * 1000, // Convert to milliseconds
            useNativeDriver: false, // width is not supported by native driver
        }).start();
    };

    const handleStartRecording = () => {
        if (!isRecording) {
            // Start countdown
            setCountdown(3);
            setIsInitiatingRecording(true); // New state to handle recording initiation
            const countdownInterval = setInterval(() => {
                setCountdown(prevCountdown => {
                    if (prevCountdown <= 1) {
                        clearInterval(countdownInterval);
                        setIsInitiatingRecording(false); // Reset initiating state
                    setIsRecording(true); // Start actual recording
                        // Start recording after countdown
                        mediaRecorderRef.current = new MediaRecorder(stream);
                        mediaRecorderRef.current.ondataavailable = handleDataAvailable;
                        mediaRecorderRef.current.start();
                        setRecordedChunks([]);
                        setIsRecording(true);
                        setPlaybackMode(false);
                        startAnimation(); // Start the timer animation

                        // Start the main timer after countdown
                        timerRef.current = setInterval(() => {
                            setTimer(prevTimer => {
                                if (prevTimer <= 0) {
                                    clearInterval(timerRef.current);
                                    handleStopRecording(); // Automatically stop recording when time is up
                                }
                                const seconds = Math.floor(prevTimer);
                                const milliseconds = (prevTimer % 1) * 1000;
                                const hundredthsOfSecond = Math.floor(milliseconds / 10);
                                const timerString = `${seconds}:${hundredthsOfSecond < 10 ? '0' : ''}${hundredthsOfSecond}`;
                                setTimerValue(timerString); // Update the timerValue state variable
                                return prevTimer - 0.01;
                            });
                        }, 10);
                    }
                    return prevCountdown - 1;
                });
            }, 1000); // Countdown interval (1 second)
        }
    };


    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            fadeOut(),
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
        setIsContinueLoading(true);
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
                navigation.navigate('ProcessingMoment', { storyId: storyId, newTwyneId: newTwyneId, promptDetail: promptDetail, promptId: promptId, primers: primers });
            } catch (error) {
                console.error('Error in uploading video:', error);
            }
        }
        setIsContinueLoading(false);
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
            fadeIn(),
                setRecordedChunks([]); // Clear the chunks for the next recording
        }
    }, [isRecording, recordedChunks, playbackMode]);

    const handleRerecord = () => {
        setIsRedoLoading(true);
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
        setIsRedoLoading(false);
    };
    const colors = ['#8C8C9E', '#F5A8A8', '#FFEBD9']; // Add more colors if you want

    return (
        <DesktopWrapper>
            <View style={styles.container}>
                <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>

                    {!playbackMode && (
                        <>
                            {/* Title Container */}
                            <View>
                                <Text style={styles.headerText}>Capture Moment </Text>
                            </View>
                            {/* Prompt Container */}
                            <View style={styles.promptContainer}>
                                <Text style={styles.promptText}>{`Prompt: ${promptDetail}`}</Text>
                            </View>
                            {/* Tag Container */}
                            <Text style={styles.tagHeader}>Things You Mentioned</Text>
                            <View style={styles.tagsContainer}>
                                {primers.map((primer, index) => (
                                    <View key={index} style={[styles.tag, { backgroundColor: tagColors[primer] }]}>
                                        <Text style={styles.tagText}>{primer}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Timer */}
                            <View style={styles.timerContainer}>
                                <Text style={styles.timerText}>{timerValue}</Text>

                            </View>
                            {isRecording ? (
                                <Animated.View style={[styles.animatedLine, {
                                    width: animatedWidth.interpolate({
                                        inputRange: [0, 100],
                                        outputRange: ['0%', '100%']
                                    })
                                }]} />
                            ) : (
                                <View style={styles.placeholderLine} />
                            )}
                            <View style={styles.cameraContainer}>
                                <video ref={videoRef} autoPlay playsInline muted style={styles.video} />
                            </View>
                            <View style={styles.buttonContainer}>
    {isRecording || isInitiatingRecording ? (
        countdown > 0 ? (
            // Show countdown or 'Stop Recording' based on countdown
            <View style={styles.buttonRecording}>
                <Text style={styles.countdownText}>{countdown > 0 ? countdown : "Stop Recording"}</Text>
            </View>
        ) : (
            <Pressable style={styles.button} onPress={handleStopRecording}>
                <Text style={styles.buttonText}>Stop Recording</Text>
            </Pressable>
        )
    ) : (
        // Show 'Start Recording' button when not recording
        <Pressable
            style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
            ]}
            onPress={handleStartRecording}
        >
            <Text style={styles.buttonText}>Start Recording</Text>
        </Pressable>
    )}
</View>


                        </>

                    )}

                    {playbackMode && (
                        <>
                            <View>
                                <Text style={styles.headerText}>Does This Look Ok? </Text>
                            </View>
                            <Text style={styles.tagHeader}>We Will Review Your Moment Next</Text>

                            <View style={styles.cameraContainer}>
                                <video ref={playbackVideoRef} src={recordedVideoURL} style={styles.video} controls />
                            </View>
                            <View style={styles.buttonContainer}>
                                <Pressable style={styles.buttonContinue} onPress={handleSend}>
                                    {isContinueLoading ? (
                                        <ActivityIndicator size="small" color="#FFF" />
                                    ) : (
                                        <Text style={styles.buttonText}>Continue</Text>
                                    )}
                                </Pressable>
                                <Pressable style={styles.buttonRedo} onPress={handleRerecord}>
                                    {isRedoLoading ? (
                                        <ActivityIndicator size="small" color="#FFF" />
                                    ) : (
                                        <Text style={styles.buttonText}>Record Again</Text>
                                    )}
                                </Pressable>
                            </View>
                        </>
                    )}
                </Animated.View>

            </View>
        </DesktopWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        position: 'relative',
        paddingTop: 30,
        height: `100%`,
    },
    placeholderLine: {
        height: 10, // Same height as the animated line
        backgroundColor: 'transparent',
    },
    tagHeader: {
        fontSize: 14, // Adjust as needed
        marginBottom: 10, // Adjust as needed
        // Add other styles as needed
    },
    video: {
        position: 'absolute', // position the video absolutely to overlap with the camera container
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonPressed: {
        backgroundColor: '#26507A', // Pressed state
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',

    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20, // Adjust as needed
    },

    tag: {
        backgroundColor: '#eee', // Adjust as needed
        borderRadius: 20, // Adjust as needed
        padding: 10, // Adjust as needed
        margin: 5, // Adjust as needed
    },

    tagText: {
        color: '#333', // Adjust as needed
        fontSize: 16, // Adjust as needed
    },

    button: {
        width: '50%', // This will make the button itself full width
        backgroundColor: '#143F6B', // This will set the button color
        padding: 10, // This will set the padding inside the button
        alignItems: 'center', // This will center the text inside the button
        borderRadius: 5, // This will round the corners of the button
        justifyContent: 'center', // This will center the text vertically
        marginTop: 10, // This will give the button margin from the top
    },
    buttonRecording: {
        width: '50%', // This will make the button itself full width
        backgroundColor: '#26507A', // This will set the button color
        padding: 10, // This will set the padding inside the button
        alignItems: 'center', // This will center the text inside the button
        borderRadius: 5, // This will round the corners of the button
        justifyContent: 'center', // This will center the text vertically
        marginTop: 10, // This will give the button margin from the top
    },

    buttonContinue: {
        width: '40%', // This will make the button itself full width
        backgroundColor: '#143F6B', // This will set the button color
        padding: 10, // This will set the padding inside the button
        alignItems: 'center', // This will center the text inside the button
        borderRadius: 5, // This will round the corners of the button
        justifyContent: 'center', // This will center the text vertically
        marginTop: 10, // This will give the button margin from the top
        marginHorizontal: 10,
        order: 1,
    },

    buttonRedo: {
        width: '40%', // This will make the button itself full width
        backgroundColor: '#424242', // This will set the button color
        padding: 10, // This will set the padding inside the button
        alignItems: 'center', // This will center the text inside the button
        borderRadius: 5, // This will round the corners of the button
        justifyContent: 'center', // This will center the text vertically
        marginTop: 10, // This will give the button margin from the top
        marginHorizontal: 10,
        order: 0,
    },

    buttonText: {
        color: '#FFFFFF', // This will set the button text color
        fontSize: 16, // This will set the button text size
    },

    promptContainer: {
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 2, // Adjust as needed
        borderColor: '#FEB139', // Adjust as needed
        backgroundColor: '#FEB139', // Adjust as needed
        width: '90%',
    },

    cameraContainer: {
        marginTop: 0,
        height: 300,
        width: 390, // make sure to set a fixed width that matches the height for a circle
        backgroundColor: '#000', // this should be half of the height and width to create a circle
        overflow: 'hidden', // this will clip the child video element to the bounds of the container
        justifyContent: 'center', // center the video vertically
        alignItems: 'center', // center the video horizontally
        marginBottom: 10,
        padding: 10,
        position: 'relative', // this will help position the video absolutely within
    },

    promptText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#424242',
    },

    timerContainer: {
        marginBottom: 10,
    },

    playbackContainer: {
        width: '100%',
        height: 400,
        backgroundColor: '#eee',
        borderRadius: 500,
        marginBottom: 10,
    },

    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    animatedLine: {
        height: 10, // Adjust as needed
        backgroundColor: '#00AEA4', // Adjust as needed
        // Add other styles as needed
    },
    countdownOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
        zIndex: 10, // Ensure it's above other elements
    },

    countdownText: {
        color: '#fff',
        fontSize: 16, // Large, easily readable text
        fontWeight: 'bold',
    },
});

export default WebCamera