import React from 'react';
import { Svg, Text, Defs, LinearGradient, Stop, Mask, Rect, TSpan } from 'react-native-svg';

const GradientText = ({ text, textStyle, gradientColors }) => {
  const textId = 'text';
  const maskId = 'mask';

  return (
    <Svg height="20%" width="100%" viewBox="0 0 200 30">
      <Defs>
      <LinearGradient id="gradient" x1="" y1="0" x2="100%" y2="100%">
  {gradientColors.map((color, index) => {
    let offset;
    if (index === 0) offset = '0';
    else if (index === gradientColors.length - 1) offset = '1';
    else offset = '0.6'; // Adjust this value to move the middle point

    return <Stop key={color} offset={offset} stopColor={color} />;
  })}
</LinearGradient>
        <Mask id={maskId}>
          <Text
            id={textId}
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".35em" // Adjust this for vertical alignment
            fontSize={textStyle.fontSize}
            fontWeight={textStyle.fontWeight}
            fontFamily={textStyle.fontFamily}
            fill="#fff"
          >
            {text}
          </Text>
        </Mask>
      </Defs>
      <Rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#gradient)"
        mask={`url(#${maskId})`}
      />
    </Svg>
  );
};

export default GradientText;
