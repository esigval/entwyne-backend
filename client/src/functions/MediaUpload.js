import React from 'react';
import { View, Button } from 'react-native';
import ImagePicker from 'react-native-image-picker';

const MediaUpload = ({ onFileSelect }) => {
    const openImagePicker = () => {
        const options = {
            title: 'Select Media',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                onFileSelect(response);
            }
        });
    };

    return (
        <View>
            <Button title="Upload Media" onPress={openImagePicker} />
        </View>
    );
};

export default MediaUpload;