import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Pressable, Image } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../config.js';
import { useNavigation } from '@react-navigation/native'
import FadeInView from '../components/FadeInView.js';
import { DataContext } from '../utils/dataContext.js';
import coupleImage from '../assets/images/CoupleFinished.png';


const DirectorReview = ({ route }) => {
    const { twynes, prompts } = useContext(DataContext);
    const { data, storyId, newTwyneId } = route.params;
    const { promptId } = data.promptId;
    const promptRecord = prompts.find(prompt => prompt.id === promptId);
    const transcription = data.transcription;
    const directorNotes = 'filler content';
    const prompt = promptRecord ? promptRecord.prompt : 'Here is Your Video';
    const navigation = useNavigation();




    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Director Review</Text>
            <View style={styles.transcriptionContainer}>
                <Text style={styles.textContent}>{prompt}</Text>
            </View>
            <Image
                style={styles.image}
                source={coupleImage} // Replace with your image uri
            />
            <View style={styles.transcriptionContainer}>
                <Text style={styles.subHeaderText}>Transcription</Text>
                <Text style={styles.textContent}>{transcription}</Text>
            </View>
            <View style={styles.notesContainer}>
                <Text style={styles.subHeaderText}>Director Notes</Text>
                <Text style={styles.textContent}>{directorNotes}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable
                    style={styles.button}
                    onPress={() => navigation.push('CameraCapture', { prompt, promptId, storyId })}
                >
                    <Text style={styles.buttonText}>Redo</Text>
                </Pressable>
                <Pressable style={styles.buttonNext}>
                    <Text style={styles.buttonNextText}>Next</Text>
                </Pressable>
            </View>
        </View>
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
        position: 'absolute', // Add this
        bottom: 50, // Add this
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
        backgroundColor: 'blue',
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
        color: '#000',
    },
    buttonNextText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default DirectorReview;