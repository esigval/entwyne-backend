import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const MarketingPromptCollectorCard = ({ promptId, title, prompt }) => {
    const navigation = useNavigation();

    const handleRequestTwynePress = () => {
        navigation.navigate('CameraCapture', {promptDetail: prompt, promptId: promptId, });
    };

    return (
        <View style={styles.cardContainer}>
            <Text style={styles.headerText}>{title}</Text>
            <Text style={styles.descriptionText}>{prompt}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleRequestTwynePress} style={styles.buttonStyle}>
                    <Icon name="camera" size={20} color="#FFFFFF" style={styles.iconStyle} />
                    <Text style={styles.buttonText}>Capture</Text>
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
        color: '#6A1B9A',
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8E24AA',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    iconStyle: {
        marginRight: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14
    }
});

export default MarketingPromptCollectorCard;
