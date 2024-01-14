import React, { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const EllipsisLoading = () => {
    const [dots, setDots] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prevDots => prevDots.length < 3 ? prevDots + '.' : '');
        }, 500); // Change dot every 500ms

        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.delay(1500), // Delay to keep dots visible
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return () => {
            clearInterval(interval);
            animation.stop();
        };
    }, [fadeAnim]);

    return <Animated.Text style={{ opacity: fadeAnim }}>.{dots}</Animated.Text>;
};

export default EllipsisLoading;


