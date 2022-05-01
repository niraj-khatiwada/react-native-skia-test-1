import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  GradientActivityIndicator,
  Home,
  Reanimated,
  ReanimatedWithGesture,
  PinchGesture,
  ImageGallery,
} from '../screens';
import {screens} from '../assets';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen component={Home} name={screens.Home} />
      <Stack.Screen
        component={GradientActivityIndicator}
        name={screens.GradientActivityIndicator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={Reanimated}
        name={screens.Reanimated}
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={ReanimatedWithGesture}
        name={screens.ReanimatedWithGesture}
      />
      <Stack.Screen component={ImageGallery} name={screens.ImageGallery} />
      <Stack.Screen
        component={PinchGesture}
        name={screens.PinchGesture}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
