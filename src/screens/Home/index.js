import {Text, Pressable} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {screens} from '../../assets';

const screenItems = [
  {
    name: screens.Reanimated,
    title: 'Transformation with Reanimated',
  },

  {
    name: screens.ReanimatedWithGesture,
    title: 'Trapped Ball',
  },
  {
    name: screens.PinchGesture,
    title: 'Pinch Gesture',
  },
  {
    name: screens.ImageGallery,
    title: 'ImageGallery',
  },
  {
    name: screens.GradientActivityIndicator,
    title: 'Gradient Activity Indicator',
  },
];

export default function Home() {
  const navigation = useNavigation();
  const handlePress = item => {
    navigation.navigate(item.name);
  };

  return screenItems.map(screen => (
    <Pressable
      key={screen.name}
      onPress={handlePress.bind(null, screen)}
      style={{
        padding: 20,
        backgroundColor: '#EFF8FF',
        borderBottomWidth: 1,
        borderBottomColor: '#CFF1EF',
      }}>
      <Text style={{fontSize: 20}}>{screen.title}</Text>
    </Pressable>
  ));
}
