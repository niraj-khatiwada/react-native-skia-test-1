import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');
const {width: windowWidth, height: windowHeight} = Dimensions.get('window');

export default function useWindowDimensions() {
  const [size, setSizes] = useState({
    screen: {
      width: screenWidth,
      height: screenHeight,
    },
    window: {
      width: windowWidth,
      height: windowHeight,
    },
  });

  const changeCallback = React.useCallback(({screen: s, window: w}) => {
    setSizes({window: {...w}, screen: {...s}});
  }, []);

  useEffect(() => {
    const event = Dimensions.addEventListener('change', changeCallback);
    return () => {
      event.remove();
    };
  }, [changeCallback]);

  return {...size};
}
