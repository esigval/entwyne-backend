import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import TwyneCard from './TwyneCard';

const TwyneGrid = ({ data, refreshControl, onPressItem }) => {
  return (
    <ScrollView
      contentContainerStyle={styles.grid}
      refreshControl={refreshControl}
    >
      {data.map((imageUrl, index) => (
        <TouchableOpacity key={index} onPress={() => onPressItem(index)}>
          <TwyneCard imageUrl={imageUrl} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
});

export default TwyneGrid;
