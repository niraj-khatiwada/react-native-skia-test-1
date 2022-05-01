import React from 'react';
import {useEffect} from 'react';
import {
  Canvas,
  useSharedValueEffect,
  useValue,
  RoundedRect,
  Group,
  useDerivedValue,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  withRepeat,
  withSpring,
  SlideInDown,
} from 'react-native-reanimated';
import {useWindowDimension} from '../../tools/hooks';

const INITIAL_SIZE = 200;

const MyComponent = () => {
  const {window} = useWindowDimension();

  const center = React.useMemo(
    () => ({
      x: window.width / 2,
      y: window.height / 2,
    }),
    [window],
  );

  const centerRect = React.useMemo(
    () => ({
      x: center.x - INITIAL_SIZE / 2,
      y: center.y - INITIAL_SIZE / 2,
    }),
    [center],
  );

  const radius = useValue(20);
  const xRR = useValue(1);
  const shared = useSharedValue(1);

  useEffect(() => {
    shared.value = withRepeat(withSpring(0.3), -1, true);
  }, [shared]);

  useSharedValueEffect(() => {
    xRR.current = shared.value;
    radius.current = shared.value * 100;
  }, shared);

  const transform = useDerivedValue(
    () => [{scale: xRR.current}, {rotate: (xRR.current * 10) / Math.PI}],
    [xRR, center],
  );

  return (
    <Animated.View style={{flex: 1}} entering={SlideInDown}>
      <Canvas
        style={{
          flex: 1,
        }}>
        <Group transform={transform} origin={center}>
          <RoundedRect
            x={centerRect.x}
            y={centerRect.y}
            width={INITIAL_SIZE}
            height={INITIAL_SIZE}
            color="red"
            r={radius}
          />
        </Group>
      </Canvas>
    </Animated.View>
  );
};

export default MyComponent;
