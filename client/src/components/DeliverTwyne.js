import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import CoupleFinished from '../assets/images/CoupleFinished.png';

const DeliverTwyne = () => {
    const fadeAnim1 = useRef(new Animated.Value(0)).current;
    const fadeAnim2 = useRef(new Animated.Value(0)).current;
    const fadeAnim3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim1, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(fadeAnim2, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(fadeAnim3, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.Text style={{ ...styles.title, opacity: fadeAnim1 }}>Your Twyne is Ready</Animated.Text>
            <Animated.Text style={{ ...styles.title, opacity: fadeAnim2 }}>Watch Below</Animated.Text>
            <Animated.View style={{ marginTop: 20, opacity: fadeAnim3 }}>
                <Image source={CoupleFinished} style={{ width: 300, height: 200, borderRadius: 15 }} />
            </Animated.View>
        </View>
    );
};

export default DeliverTwyne;

const styles = StyleSheet.create({
    title: {
        fontSize: 36,
        fontWeight: 'regular',
        textAlign: 'center',
        color: '#424242',
    },
});