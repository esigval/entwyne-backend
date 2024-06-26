import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { API_BASE_URL } from '../../config.js';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { fadeIn, fadeOut, fadeTransition } from '../functions/fadeAnimations.js';
import couplePhoto from '../assets/images/CoupleFinished.png';
import { WebFileUpload } from '../components/WebFileUpload.js/WebFileUpload.js'; // Import your WebFileUpload component
import DesktopWrapper from '../components/DesktopWrapper';


const PhotoUpload = ({ route }) => {
    const navigation = useNavigation();
    const [imageThumbnails, setImageThumbnails] = useState([]);
    const [files, setFiles] = useState([]); // Add this line
    const [isLoading, setIsLoading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [primers, setPrimers] = useState([]);

    const directorNotes = 'A Few Ideas for Photos';
    const isUploadable = imageThumbnails.length > 0;

    const { data, newTwyneId, storyId, promptDetail, promptId } = route.params;
    const momentVideo = data.thumbnailUrl;
    
    /*const storyId = '65b2bf30ace0b8b7419e8336';
    const momentVideo = couplePhoto;
    const promptId = '65a59778e91d4c46ebf40ed6';*/

    useEffect(() => {
        const fetchPrimers = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/v1/getPrimers/${storyId}`); // Replace with your actual API path
                setPrimers(response.data);
            } catch (err) {
                console.error('Failed to fetch primers:', err);
            }
        };

        fetchPrimers();
    }, [storyId]);



    const handleRemoveThumbnail = (name) => {
        // Filter out the thumbnail and file with the matching name
        const updatedThumbnails = imageThumbnails.filter(thumbnail => thumbnail.name !== name);
        setImageThumbnails(updatedThumbnails);

        const updatedFiles = files.filter(file => file.name !== name);
        setFiles(updatedFiles);
    };

    const handleFilesSelect = (newFiles) => {
        // Concatenate the new files with the already existing ones
        const updatedFiles = [...files, ...newFiles];

        // Update the files state
        setFiles(updatedFiles);

        // Update the thumbnails for images
        const updatedImageThumbnails = [...imageThumbnails, ...newFiles.map(file => ({
            name: file.name,
            preview: URL.createObjectURL(file)
        }))];

        // Set the image thumbnails state
        setImageThumbnails(updatedImageThumbnails);
    };


    const handleSubmit = async () => {
        if (!isUploadable || isLoading) return;

        setIsLoading(true);

        let storylineId;

        // Loop through the files state array and upload each file
        for (const file of files) {
            try {
                // Get the pre-signed URL from your backend
                const response = await axios.get(`${API_BASE_URL}/v1/collectPictures`, {
                    params: { fileName: file.name, fileType: file.type, promptId: promptId }
                });

                console.log('response:', response);

                if (response.status === 200 && response.data.presignedUrl) {
                    const { presignedUrl } = response.data;

                    // Assign storylineId here
                    storylineId = response.data.storylineId;
                    console.log(`storylineid`, storylineId)

                    // Set the headers for the PUT request
                    const options = {
                        headers: {
                            'Content-Type': file.type
                        }
                    };

                    // PUT request to the pre-signed URL with the file data
                    const result = await axios.put(presignedUrl, file, options);

                    if (result.status === 200) {
                        console.log(`File uploaded successfully: ${presignedUrl}`);
                    } else {
                        // Handle the PUT request failure
                        console.error('Failed to upload file:', file.name);
                    }
                } else {
                    // Handle failure to get the pre-signed URL
                    console.error('Failed to get a signed URL for:', file.name);
                }
            } catch (error) {
                console.error('Error during file upload:', error);
            }
        }
        console.log('storylineId:', storylineId)
        setIsLoading(false);
        setIsUploaded(true);
        setTimeout(() => {
            fadeOut();
            navigation.navigate('TitleDetails', { storylineId, data, newTwyneId, storyId, promptDetail, promptId });
        }, 1000);
    };

    useEffect(() => {
        // This will be called when the component is unmounted
        return () => {
            // Revoke the object URL
            imageThumbnails.forEach(thumbnail => URL.revokeObjectURL(thumbnail.preview));
        };
    }, [imageThumbnails]);

    const colors = ['#8C8C9E', '#F5A8A8', '#FFEBD9']; // Add more colors if you want



    return (
        <DesktopWrapper>
            <View style={styles.container}>
                <Text style={styles.headerText}>Photo Upload</Text>
                <Image
                    style={styles.image}
                    source={momentVideo}
                />
                <View style={styles.notesContainer}>
                    <Text style={styles.textContent}>{directorNotes}</Text>
                </View>
                <View style={styles.tagsContainer}>
    {primers.map((primer, index) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
            <View key={index} style={[styles.tag, {backgroundColor: color}]}>
                <Text style={styles.tagText}>{primer}</Text>
            </View>
        );
    })}
</View>


                {/* File Upload Component */}
                <WebFileUpload onFilesSelect={handleFilesSelect} />


                {/* Display Image Thumbnails */}
                <View style={styles.thumbnailContainer}>
                    {imageThumbnails.map((image, index) => (
                        <View key={image.name} style={styles.thumbnail}>
                            <Image
                                source={{ uri: image.preview }}
                                style={styles.imagePreview}
                            />
                            {/* Remove Button */}
                            <Pressable style={styles.removeButton} onPress={() => handleRemoveThumbnail(image.name)}>
                                <Text style={styles.removeButtonText}>X</Text>
                            </Pressable>
                        </View>
                    ))}
                </View>




                <View style={styles.buttonContainer}>
                    <Text style={styles.textAboveButton}>I'm ready to submit</Text>
                    {/* Submit Button */}

                    <Pressable
                        style={isUploadable ? (isUploaded ? styles.buttonUploaded : styles.buttonActive) : styles.buttonInactive}
                        onPress={handleSubmit}
                        disabled={!isUploadable || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : isUploaded ? (
                            <Text style={styles.buttonText}>Complete!</Text>
                        ) : (
                            <Text style={styles.buttonText}>Submit</Text>
                        )}
                    </Pressable>

                </View>
            </View>
        </DesktopWrapper>
    );
};



const styles = StyleSheet.create({
    textAboveButton: {
        marginBottom: 10, // Add some margin at the bottom
        fontSize: 16, // Set the font size
        textAlign: 'center', // Center the text horizontally
        // Other styles as needed...
    },
    buttonUploaded: {
        backgroundColor: '#F55353', // Active color (blue)
        padding: 15,
        borderRadius: 20,
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    buttonActive: {
        backgroundColor: '#143F6B', // Active color (blue)
        padding: 15,
        borderRadius: 20,
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    buttonInactive: {
        backgroundColor: '#eee', // Inactive color (grey)
        padding: 15,
        borderRadius: 20,
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    thumbnailContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 10,
    },
    thumbnail: {
        marginRight: 10,
        position: 'relative',
    },
    imagePreview: {
        width: 50, // Set the width and height as per your UI needs
        height: 50,
    },
    removeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'grey',
        width: 20, // Small hit area for the remove button
        height: 20,
        borderRadius: 10, // Circular button
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,
        backgroundColor: '#fff',
        position: 'relative',
        height: '100%',
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
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
        height: 100, // You might want to adjust this
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
    notesContainer: {
        width: '90%',
        padding: 15,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    subHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    textContent: {
        fontSize: 24,
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '90%',
        position: 'absolute',
        textAlign: 'center',
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
        color: 'white',
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

export default PhotoUpload;