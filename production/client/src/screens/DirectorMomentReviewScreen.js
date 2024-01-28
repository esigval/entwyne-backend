import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Pressable, Image, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../config.js';
import { useNavigation } from '@react-navigation/native'
import FadeInView from '../components/FadeInView.js';
import couplePhoto from '../assets/images/CoupleFinished.png';
import { DataContext } from '../utils/dataContext.js';
import DesktopWrapper from '../components/DesktopWrapper';


const DirectorReview = ({ route }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { twynes, prompts } = useContext(DataContext);
    const { data, storyId, newTwyneId, promptDetail, promptId } = route.params;
    
    const transcription = data.transcription;
    const directorNotes = data.directorReview;
    const sentiment = data.sentimentAnalysis;
    const score = data.directorReviewScore;
    const momentVideo = data.thumbnailUrl;
    const mediaType = 'video';
    const navigation = useNavigation();
    /*const prompt = promptDetail;
    
    const data = 'filler';
    const promptId = '65a59778e91d4c46ebf40ed6';
    console.log('promptId', promptId)
    const transcription = 'filler';
    const directorNotes = 'filler';
    const sentiment = 'filler';
    const score = 'filler';
    const promptDetail = 'filler';
    const newTwyneId = 'filler';*/

    const handleDeleteTwyne = () => {
        axios.delete(`${API_BASE_URL}/v1/deleteTwyne/${newTwyneId}`)
            .then(response => {
                if (response.status === 200) {
                    navigation.goBack(); // Go back to the previous screen
                } else {
                    // Handle error response
                    console.error('Error:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const handleConfirmTwyne = () => {
        setIsLoading(true);
        axios.get(`${API_BASE_URL}/v1/confirmTwyne?promptId=${promptId}&newTwyneId=${newTwyneId}`)
            .then(response => {
                if (response.status === 200) {
                    if (response.data === true) {
                        navigation.navigate('PhotoUpload', { data, newTwyneId, storyId, promptDetail, promptId });
                    } else {
                        navigation.navigate('PromptCollection', { newTwyneId, storyId, promptDetail, promptId, mediaType });
                    }
                } else {
                    // Handle error response
                    console.error('Error:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    return (
        <DesktopWrapper>
            <View style={styles.container}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                    <Text style={styles.headerText}>Director Review</Text>
                    <View style={styles.transcriptionContainer}>
                        <Text style={styles.textContent}>{prompt}</Text>
                    </View>
                    <Image
                        style={styles.image}
                        source={{ uri: momentVideo }}
                    />
                    <View style={styles.transcriptionContainer}>
                        <Text style={styles.subHeaderText}>Transcription</Text>
                        <Text style={styles.textContent}>{transcription}</Text>
                    </View>
                    <View style={styles.notesContainer}>
                        <Text style={styles.subHeaderText}>Director Feedback</Text>
                        <Text style={styles.textContent}>{directorNotes}</Text>
                    </View>
                    <View style={styles.splitContainer}>
                        <View style={styles.column}>
                            <Text style={styles.subHeaderText}>Sentiment</Text>
                            <Text style={styles.textContent}>{sentiment}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.subHeaderText}>Score</Text>
                            <Text style={styles.textContent}>{score}</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            navigation.navigate('CameraCapture', { promptDetail, promptId, storyId, fromScreen: 'DirectorReview' });

                        }}
                    >
                        <Text style={styles.buttonText}>Film Again</Text>
                    </Pressable>
                    <Pressable style={styles.buttonNext}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#0000ff" />
                        ) : (
                            <Text style={styles.buttonNextText} onPress={handleConfirmTwyne}>Submit</Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </DesktopWrapper>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,
        backgroundColor: '#fff',
        position: 'relative',
        height: '100%',
    },
    scrollView: {
        width: '100%',
        flex: 1, // Makes sure the ScrollView takes up the remaining space
    },
    scrollViewContent: {
        alignItems: 'center',
        paddingBottom: 100, // This should be the height of your buttonContainer
    },

    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: '90%',
        height: 200, // You might want to adjust this
        borderRadius: 10,
        marginBottom: 20,
    },
    transcriptionContainer: {
        width: '90%',
        padding: 15,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 10,
    },
    notesContainer: {
        width: '90%',
        padding: 15,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 20,
    },
    subHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    textContent: {
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        position: 'absolute',
        bottom: 10, // Position at the bottom of the container
        // Height, backgroundColor, padding, etc. for your button container
    },
    button: {
        backgroundColor: '#eee',
        padding: 15,
        borderRadius: 20,
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    buttonNext: {
        backgroundColor: '#143F6B',
        padding: 15,
        borderRadius: 20,
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#143F6B',
    },
    buttonNextText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    splitContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%', // Set the width similar to other containers
        marginBottom: 20,
    },
    column: {
        flex: 1, // This ensures that each column takes up equal space
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15, // Optional, for internal spacing
    },
});

export default DirectorReview;