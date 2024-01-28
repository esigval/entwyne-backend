// src/navigation/TabNavigator.js
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Tab1Screen from '../screens/Tab1Screen';
import Tab2Screen from '../screens/Tab2Screen';
import Tab3Screen from '../screens/Tab3Screen';

const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Stories" component={Tab1Screen} />
      <Tab.Screen name="Prompts" component={Tab2Screen} />
      <Tab.Screen name="Moments" component={Tab3Screen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
