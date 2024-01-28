import React from 'react';
import { View, Text, StyleSheet } from 'react-native';



const AppHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 0, // You can adjust the height as needed
    backgroundColor: '#6A1B9A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    marginTop: 20, // You can adjust the margin as needed
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AppHeader;
