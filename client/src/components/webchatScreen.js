import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>entwyne</Text>
        {/* SVG or View components for the double lines */}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Tell Your Love Story Together.</Text>
        <Text style={styles.description}>
          Entwyne is an AI Film Director in your pocket, collaboratively
          collecting stories from engagement to wedding and beyond, to preserve
          and share the moments that matter the most.
        </Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Try it Now</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>Opens a Demo Experience.</Text>
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
    },
    header: {
      // Style for header container
    },
    headerText: {
      // Style for the header text
    },
    content: {
      // Style for content container
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 10,
    },
    footer: {
      // Style for footer container
    },
    button: {
      backgroundColor: 'blue',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 25,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
    },
    footerText: {
      fontSize: 12,
      textAlign: 'center',
      color: 'grey',
      marginTop: 5,
    },
    // Add styles for the lines
  });
  
