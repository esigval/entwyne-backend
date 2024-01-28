import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ImageBackground, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DesktopWrapper from '../components/DesktopWrapper';
import logo from '../assets/entwyneLogoColor.png';
import Svg, { Path } from 'react-native-svg';
import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedProps } from 'react-native-reanimated';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
if (Platform.OS === 'web') {
    require('../styles/EntryScreen.css');
}
import SlideInModal from '../components/SlideInModal.js';

const EntryScreen = ({ }) => {
    const [isLoading, setIsLoading] = useState(false);
    const AnimatedPath = Animated.createAnimatedComponent(Path);
    const animation = useSharedValue(0);
    const navigation = useNavigation();

    const createStory = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/v1/createStory`);
            const { _id, threadId } = response.data.updatedStory;
            navigation.navigate('DirectorChat', { storyId: _id, threadId: threadId });
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        animation.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
    }, []);

    const animatedProps = useAnimatedProps(() => {
        return {
            transform: [{ translateX: (animation.value - 0.5) * 10 }],
        };
    }, []); // Pass an empty dependency array here

    return (
        <DesktopWrapper>
            <View style={styles.container}>

                <Image style={styles.logo} source={logo}></Image>
                <Text style={styles.titleText}>
                    Tell Your{'\n'}
                    Love Story{'\n'}
                    <Text style={{ color: '#F55353' }}>Together.</Text>
                </Text>
                <Text style={styles.descriptionText}>
                    Entwyne is an AI Film Director in your pocket, collaboratively collecting stories from engagement to wedding
                    and beyond, to preserve and share the moments that matter the most.
                </Text>
                <TouchableOpacity style={styles.button} onPress={createStory}>
            <View style={styles.innerContainer}>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Text style={styles.buttonText}>Try it Now</Text>
                )}
            </View>
        </TouchableOpacity>
                <Text style={styles.footerText}>Opens a Demo Experience.</Text>
                <Svg width="100%" height="100%" viewBox="0 0 305 812" style={styles.backgroundSvg}>
                    <Path
                        className="animatedPath1" // Here you apply the CSS animation
                        d="M2 -1.5V269.5C2 299.876 26.6243 324.5 57 324.5H238.5C268.876 324.5 293.5 349.124 293.5 379.5V521.5C293.5 551.876 268.876 576.5 238.5 576.5H57C26.6243 576.5 2 601.124 2 631.5V812"
                        stroke="#F55353"
                        strokeOpacity="0.15"
                        strokeWidth="3"
                        fill="none"
                    />
                    <Path
                        className="animatedPath2" // Here you apply the CSS animation
                        d="M12 -9.5V269C12 299.376 36.6243 324 67 324H248.5C278.876 324 303.5 348.624 303.5 379V521C303.5 551.376 278.876 576 248.5 576H67C36.6243 576 12 600.624 12 631V811.5"
                        stroke="#143F6B"
                        strokeOpacity="0.15"
                        strokeWidth="3"
                        fill="none"
                    />
                </Svg>

            </View>
        </DesktopWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: '#fff',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    logo: {
        width: '60%',
        aspectRatio: 3,
    },
    backgroundSvg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1, // Make sure the SVG is behind other content
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 32,
        color: '#000',
        // Additional styles such as font family and weight can be added here
    },
    titleText: {
        fontSize: 32,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 110,
        // Additional styles for the title text
    },
    descriptionText: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
        paddingHorizontal: 100,
        // Additional styles for the description text
    },
    button: {
        marginTop: 20,
        backgroundColor: '#143F6B', // Replace with the color of your button
        padding: 10,
        borderRadius: 20,
        // Additional styles for the button
    },
    buttonText: {
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center',
        // Additional styles for the button text
    },
    footerText: {
        fontSize: 14,
        color: '#000',
        marginTop: 10,
        // Additional styles for the footer text
    },
    innerContainer: {
        height: 50, // Adjust as needed
        width: 200, // Adjust as needed
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EntryScreen;
