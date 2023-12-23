import React, { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native'
import '../styles/TwyneLoadingScreen.css';
import TwynesMobile from '../assets/vectors/twynes.svg'; // Rename for clarity
import Thumbnail from './Thumbnail';
import thumbnail1 from '../assets/images/thumbail1.png';
import couple from '../assets/images/couple.png';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// import { useNavigation } from '@react-navigation/native'; // if using react-navigation

const TwyneLoadingScreen = () => {
    gsap.registerPlugin(MotionPathPlugin);
    // const navigation = useNavigation(); // if using react-navigation
    const [progress, setProgress] = useState(0);
    const [text, setText] = useState('Entwining');
    const navigation = useNavigation();

    // Thumbnail animation values
    const thumbnailAnim = new Animated.Value(0);

    function animateAlongPath(rectangleId, pathId, animationDelay) {
        const tl = gsap.timeline({ delay: animationDelay });

        gsap.set(rectangleId, { opacity: 0 });

        tl.to(rectangleId, {
            duration: 10,
            ease: "power1.inOut",
            motionPath: {
                path: pathId,
                align: pathId,
                autoRotate: false,
                alignOrigin: [0.5, 0.5]
            }
        });

        tl.to(rectangleId, {
            duration: 5,
            opacity: 1,
            ease: "power1.inOut"
        }, "-=10");

        return tl;
    }

    useEffect(() => {
        if (progress >= 100) {
            // Get the progressText element
            const progressText = document.getElementById('progressText');

            // Add the pop-fade class
            progressText.classList.add('pop-fade');
        }
    }, [progress]);

    useEffect(() => {
        animateAlongPath("#rectangle1", "#path1", 2);
        animateAlongPath("#rectangle2", "#path2", 1.5);
        animateAlongPath("#rectangle3", "#path3", 2.2);
        animateAlongPath("#rectangle4", "#path4", 3);
    }, []);


    useEffect(() => {
        // Start the thumbnail animation
        Animated.timing(thumbnailAnim, {
            toValue: 100,
            duration: 3000, // Duration of the animation
            useNativeDriver: true // Use native driver for better performance
        }).start(() => {
            // Handle animation end
            // navigation.navigate('NextScreen'); // Navigate to the next screen
        });

        // Start progress update
        // Start progress update
        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                const newProgress = oldProgress + 5;
                if (newProgress >= 100) {
                    clearInterval(interval);

                    // Define the paths and their corresponding animations
                    const pathsAndAnimations = [
                        { id: 'path1', animation: 'line-animation-1', reverseAnimation: 'line-animation-reverse-1' },
                        { id: 'path2', animation: 'line-animation-2', reverseAnimation: 'line-animation-reverse-2' },
                        { id: 'path3', animation: 'line-animation-3', reverseAnimation: 'line-animation-reverse-3' },
                        { id: 'path4', animation: 'line-animation-4', reverseAnimation: 'line-animation-reverse-4' },
                    ];

                    // For each path
                    pathsAndAnimations.forEach(({ id, animation, reverseAnimation }) => {
                        // Get the path element
                        const path = document.getElementById(id);

                        // Remove the first animation class
                        path.classList.remove(animation);

                        // Add the second animation class
                        path.classList.add(reverseAnimation);

                        path.addEventListener('animationend', () => {
                            // Navigate to the DeliverTwyne screen
                            setTimeout(() => {
                                navigation.navigate('DeliverTwyne');
                            }, 500);
                        });
                    });
                    const statusText = document.getElementById('statusText');
                    statusText.textContent = 'All Done!';


                    // Add the pop-fade animation
                    statusText.style.animation = 'pop-fade 2s forwards';

                }
                return newProgress;
            });
        }, 400); // Update progress every 300ms

        return () => clearInterval(interval); // Clean up interval on component unmount
    }, []);

    // Calculate thumbnail positions based on animation value here...

    const Twynes = Platform.OS === 'web' ?
        () => <img src="../assets/vectors/twynes.svg" alt="Twynes" style={{ width: '100%', height: '100%' }} /> :
        TwynesMobile;

    return (
        <View style={styles.container}>
            <View style={styles.backgroundSvg}>
                {Platform.OS === 'web' ? (
                    <svg width="450" height="1000" viewBox="0 0 305 812" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="image1" patternUnits="userSpaceOnUse" width="64" height="34.5">
                                <svg width="64" height="34.5">
                                    <image href={couple} x="0" y="0" width="64" height="34.5" />
                                </svg>
                            </pattern>
                        </defs>
                        <path id="path1" className="line-animation-1" d="M2 0V353.817C2 384.193 26.6243 408.817 57 408.817H84.5H112C142.376 408.817 167 433.442 167 463.817V823.108C167 853.483 142.376 878.108 112 878.108H84.5H57C26.6243 878.108 2 902.732 2 933.108V1119" stroke="#143F6B" strokeOpacity="0.46" strokeWidth="8" />
                        <rect id="rectangle1" x="0" y="0" width="64" height="34.5" fill="url(#image1)" />
                        <defs>
                            <pattern id="image2" patternUnits="userSpaceOnUse" width="64" height="34.5">
                                <svg width="64" height="34.5">
                                    <image href={couple} x="0" y="0" width="64" height="34.5" />
                                </svg>
                            </pattern>
                        </defs>
                        <path id="path2" className="line-animation-2" d="M59 0V353.817C59 384.193 83.6243 408.817 114 408.817H116.518V408.817C146.055 408.817 170 432.762 170 462.299V824.626C170 854.163 146.055 878.108 116.518 878.108V878.108H114C83.6243 878.108 59 902.732 59 933.108V1119" stroke="#F55353" strokeOpacity="0.6" strokeWidth="8" />
                        <rect id="rectangle2" x="0" y="0" width="64" height="34.5" fill="url(#image2)" />
                        <defs>
                            <pattern id="image3" patternUnits="userSpaceOnUse" width="64" height="34.5">
                                <svg width="64" height="34.5">
                                    <image href={couple} x="0" y="0" width="64" height="34.5" />
                                </svg>
                            </pattern>
                        </defs>
                        <path id="path3" className="line-animation-3" d="M239 0V368.317C239 390.685 220.868 408.817 198.5 408.817V408.817V408.817C176.132 408.817 158 426.95 158 449.317V837.608C158 859.975 176.132 878.108 198.5 878.108V878.108V878.108C220.868 878.108 239 896.24 239 918.608V1119" stroke="#FEB139" strokeOpacity="0.5645" strokeWidth="8" />
                        <rect id="rectangle3" x="0" y="0" width="64" height="34.5" fill="url(#image3)" />
                        <defs>
                            <pattern id="image4" patternUnits="userSpaceOnUse" width="64" height="34.5">
                                <svg width="64" height="34.5">
                                    <image href={couple} x="0" y="0" width="64" height="34.5" />
                                </svg>
                            </pattern>
                        </defs>
                        <path id="path4" className="line-animation-4" d="M303 0V353.817C303 384.193 278.376 408.817 248 408.817H226.533H210C179.624 408.817 155 433.442 155 463.817V823.108C155 853.483 179.624 878.108 210 878.108H226.533H248C278.376 878.108 303 902.732 303 933.108V1119" stroke="#575757" strokeOpacity="0.6" strokeWidth="8" />
                        <rect id="rectangle4" x="0" y="0" width="64" height="34.5" fill="url(#image4)" />
                    </svg>
                ) : (
                    // Mobile SVG component
                    <TwynesMobile width={'100%'} height={'100%'} />
                )}
            </View>
            {/* Animated thumbnails */}
            {/* Progress text */}
            <View style={styles.progressContainer}>
                <Text id="statusText" className="statusText">Entwyning</Text>
                <Text id="progressText" className="progressText" style={styles.progressText}>{progress}%</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    progressContainer: {
        position: 'absolute',
        top: '20%', // Top third of the container
        justifyContent: 'center',
        alignItems: 'center', // Add this
        width: '100%', // Add this to make sure the container takes the full width
    },
    progressText: {
        fontSize: 36, // Adjust as needed
        color: '#00AEA4', // Adjust as needed 
        textAlign: 'center', // Add this to center the text within the progressContainer
    },
});

export default TwyneLoadingScreen;
