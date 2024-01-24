import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import FinalRenderVideo from '../components/FinalRenderVideo.js';
import DesktopWrapper from '../components/DesktopWrapper.web.js';

const DeliverTwyne = ({ route }) => {
    const { storylineId } = route.params;
    
    const fadeAnim1 = useRef(new Animated.Value(0)).current;
    const fadeAnim2 = useRef(new Animated.Value(0)).current;
    const fadeAnim3 = useRef(new Animated.Value(0)).current;
    const dropAnim = useRef(new Animated.Value(-1500)).current; // New animation value

    useEffect(() => {
        Animated.sequence([
            Animated.timing(dropAnim, { toValue: 0, duration: 1500, useNativeDriver: true }), // New animation
            Animated.timing(fadeAnim1, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(fadeAnim2, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(fadeAnim3, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <DesktopWrapper>
        <View style={styles.container}>
            <Animated.View style={{ ...styles.fallingContainer, transform: [{ translateY: dropAnim }] }}> {/* New animated view */}
                <Animated.Text style={{ ...styles.title, opacity: fadeAnim1 }}>Your Twyne is Ready</Animated.Text>
                <Animated.Text style={{ ...styles.title, opacity: fadeAnim2 }}>Watch Below</Animated.Text>
                <Animated.View style={{ marginTop: 20, opacity: fadeAnim3 }}>
                    <FinalRenderVideo storylineId={storylineId} />
                </Animated.View>
            </Animated.View>
        </View>
        </DesktopWrapper>
    );
};

export default DeliverTwyne;

const styles = StyleSheet.create({
    title: {
        fontSize: 36,
        fontWeight: 'regular',
        textAlign: 'center',
        color: '#FFF',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
        backgroundColor: '#FFF',
        position: 'relative',
        height: '100%',
    },
    fallingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#424242',
        width: '100%',
        height: '100%',
        position: 'absolute', // Changed from 'relative' to 'absolute'
        top: 0, // New property
        left: 0, // New property
    },
});