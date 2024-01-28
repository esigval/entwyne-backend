import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    card: {
      width: 300,
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 20,
      marginRight: 20, // Give some space between the card and options
      elevation: 4, // This adds a shadow on Android
      shadowOpacity: 0.25, // This adds a shadow on iOS
      shadowRadius: 5,
      shadowOffset: { height: 2, width: 0 },
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    description: {
      fontSize: 16,
      marginVertical: 8,
    },
    button: {
      backgroundColor: '#6200EE',
      padding: 10,
      marginVertical: 5,
      borderRadius: 4,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    options: {
      position: 'absolute',
      right: -300, // Start off-screen to the right
      top: 0,
      bottom: 0,
      backgroundColor: '#DDD',
      padding: 20,
      justifyContent: 'center',
    },
  });