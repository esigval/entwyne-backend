import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, ActionSheetIOS } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import ShareYourStoryScreen from './QRCode';


const PromptCard = ({ promptId, title, description, onRequestTwyne, onUpload, onEdit }) => {
    const { showActionSheetWithOptions } = useActionSheet();
    const navigation = useNavigation();
    const handleSendTextMessage = () => {
        // You can customize this number and message
        const phoneNumber = '1234567890';
        const message = "Hey I just captured a video for ${title}! Check it out at https://twyne.io/1234567890;"
        const smsLink = Platform.OS === 'android'
            ? `sms:${phoneNumber}?body=${message}`
            : `sms:${phoneNumber}&body=${message}`;

        Linking.canOpenURL(smsLink)
            .then((supported) => {
                if (!supported) {
                    console.log("Can't handle sms link");
                } else {
                    return Linking.openURL(smsLink);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    };
    
    const handleRequestTwynePress = () => {
        const options = ['Capture', 'Send Text Message', 'Create QR Code', 'Create Link', 'Cancel'];
        const cancelButtonIndex = 4;
    
        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        navigation.navigate('CameraCapture', {promptDetail: description, promptId: promptId});
                        break;
                    case 1:
                        handleSendTextMessage();
                        break;
                    case 2:
                        navigation.navigate('ShareYourStoryScreen', { data: 'Your data to encode in the QR code' });
                        break;
                    case 3:
                        onRequestTwyne('link');
                        break;
                }
            },
        );
    };

    return (
        <View style={styles.cardContainer}>
            <Text style={styles.headerText}>{title}</Text>
            <Text style={styles.descriptionText}>{description}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleRequestTwynePress(promptId)} style={styles.buttonStyle}>
                    <Icon name="camera" size={20} color="#FFFFFF" style={styles.iconStyle} />
                    <Text style={styles.buttonText}>Capture</Text>
                </TouchableOpacity>
                {/* Implement onPress handlers for Upload and Edit as needed */}
                <TouchableOpacity onPress={onUpload} style={[styles.buttonStyle, styles.buttonOutline]}>
                    <Text style={[styles.buttonText, styles.buttonOutlineText]}>Upload</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onEdit} style={[styles.buttonStyle, styles.buttonOutline]}>
                    <Text style={[styles.buttonText, styles.buttonOutlineText]}>Edit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#FFFFFF',
        padding: 14,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        alignItems: 'flex-start',
        margin: 2,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6A1B9A', // This should be the purple color from your design
    },
    descriptionText: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 16
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonStyle: {
        flexDirection: 'row', // Align icon and text horizontally
        alignItems: 'center', // Center icon and text vertically in the button
        backgroundColor: '#8E24AA', // This should be the purple color of the button
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8
    },
    iconStyle: {
        marginRight: 8, // Add some margin between the icon and text
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#8E24AA' // Border color should match the filled button color
    },
    buttonOutlineText: {
        color: '#8E24AA' // Text color should match the filled button color
    }
});

export default PromptCard;
