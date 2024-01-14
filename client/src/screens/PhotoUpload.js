import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ScrollView } from 'react-native';
import { API_BASE_URL } from '../../config.js';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import couplePhoto from '../assets/images/CoupleFinished.png';
import { WebFileUpload } from '../components/WebFileUpload.js/WebFileUpload.js'; // Import your WebFileUpload component

const PhotoUpload = ({ route }) => {
    const navigation = useNavigation();
    const [imageThumbnails, setImageThumbnails] = useState([]);
    const [files, setFiles] = useState([]); // Add this line
    const directorNotes = 'Now We’re Going to Fill in Some Moments Between the Film...';
    const isUploadable = imageThumbnails.length > 0;

    const { data, newTwyneId, storyId, promptDetail, promptId } = route.params;
    const momentVideo = data.thumbnailUrl;
    

    const handleRemoveThumbnail = (name) => {
        // Filter out the thumbnail and file with the matching name
        const updatedThumbnails = imageThumbnails.filter(thumbnail => thumbnail.name !== name);
        setImageThumbnails(updatedThumbnails);

        const updatedFiles = files.filter(file => file.name !== name);
        setFiles(updatedFiles);
    };

    const handleFilesSelect = (files) => {
        setFiles(files);
        // Set the thumbnails for images
        setImageThumbnails(files.map(file => ({
            name: file.name,
            preview: URL.createObjectURL(file)
        })));
    };

    const handleSubmit = async () => {
        if (!isUploadable) return; // Check if there are files to upload

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

        navigation.navigate('TwyneLoadingScreen', { storylineId: storylineId });
    };



    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Photo Upload</Text>
            <Image
                style={styles.image}
                source={momentVideo}
            />
            <View style={styles.notesContainer}>
                <Text style={styles.textContent}>{directorNotes}</Text>
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
                    style={isUploadable ? styles.buttonActive : styles.buttonInactive}
                    onPress={isUploadable ? handleSubmit : null} // Replace `handleSubmit` with your actual submit function
                    disabled={!isUploadable}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
            </View>
        </View>
    );
};



const styles = StyleSheet.create({
    textAboveButton: {
        marginBottom: 10, // Add some margin at the bottom
        fontSize: 16, // Set the font size
        textAlign: 'center', // Center the text horizontally
        // Other styles as needed...
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