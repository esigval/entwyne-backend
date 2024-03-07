import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet } from 'react-native';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const ConfirmationScreen = () => {
    const { token } = useParams();
    const [confirmationStatus, setConfirmationStatus] = useState('pending');

    useEffect(() => {
        axios.post(`${API_BASE_URL}/v1/confirmEmail`, { token })
            .then(response => {
                console.log(response.data);
                setConfirmationStatus('success'); // Update state to indicate success
            })
            .catch((error) => {
                console.error('Error:', error);
                setConfirmationStatus('error'); // Update state to indicate error
            });
    }, [token]);

    return (
        <View style={styles.container}>
            {confirmationStatus === 'pending' && <Text style={styles.message}>Confirming your email...</Text>}
            {confirmationStatus === 'success' && (
                <>
                    <Text style={styles.title}>Your email has been confirmed!</Text>
                    <Text style={styles.message}>Your email address has been successfully changed.</Text>
                </>
            )}
            {confirmationStatus === 'error' && <Text style={styles.message}>There was an error confirming your email. Please try again.</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20
    },
    message: {
        fontSize: 18,
        textAlign: 'center'
    }
});

export default ConfirmationScreen;