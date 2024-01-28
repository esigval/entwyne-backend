import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const ChatTail = () => {
    return (
      <Svg style={styles.tail} width="15" height="24" viewBox="0 0 15 24" fill="none">
        <Path d="M0 0L15 12L0 24V0Z" fill="#E1E3E5" />
      </Svg>
    );
  };

  const styles = StyleSheet.create({
    tail: {
      position: 'absolute',
      bottom: 0,
      left: -15,
    },
  });