import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import TwyneCard from './TwyneCard';

const data = [
    {
      prompt: 'Prompt 1',
      characters: ['Evan', 'Ana', 'Rowan'],
      capturedBy: 'Captured By 1',
      description: 'Description 1',
    },
    {
      prompt: 'Prompt 2',
      characters: ['Evan', 'Ana', 'Rowan'],
      capturedBy: 'Captured By 2',
      description: 'Description 2',
    },
    {
      prompt: 'Prompt 1',
      characters: ['Evan', 'Ana', 'Rowan'],
      capturedBy: 'Captured By 1',
      description: 'Description 1',
    },
    {
      prompt: 'Prompt 2',
      characters: ['Evan', 'Ana', 'Rowan'],
      capturedBy: 'Captured By 2',
      description: 'Description 2',
    },
    {
      prompt: 'Prompt 1',
      characters: ['Evan', 'Ana', 'Rowan'],
      capturedBy: 'Captured By 1',
      description: 'Description 1',
    },
    {
      prompt: 'Prompt 2',
      characters: ['Evan', 'Ana', 'Rowan'],
      capturedBy: 'Captured By 2',
      description: 'Description 2',
    },
  ];

const MediaGrid = () => {
  return (
    <ScrollView contentContainerStyle={styles.grid}>
      {data.map((item, index) => (
        <TwyneCard
          key={index}
          prompt={item.prompt}
          characters={item.characters}
          capturedBy={item.capturedBy}
          description={item.description}
        />
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

export default MediaGrid;
