import React from 'react';
import {useEffect} from 'react';
import {
  Canvas,
  useSharedValueEffect,
  useValue,
  RoundedRect,
  Group,
  useDerivedValue,
  useTouchHandler,
  runSpring,
  Spring,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  withSequence,
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
  const rx = useValue(0);
  const ry = useValue(0);

  useEffect(() => {
    shared.value = withSequence(withSpring(0.3), withSpring(1));
  }, [shared]);

  useSharedValueEffect(() => {
    xRR.current = shared.value;
    radius.current = shared.value * 100;
  }, shared);

  const transform = useDerivedValue(
    () => [
      {scale: xRR.current},
      {rotate: (xRR.current * 10) / Math.PI},
      {translateX: rx.current},
      {translateY: ry.current},
    ],
    [xRR, rx, ry],
  );

  const touchHandler = useTouchHandler(
    {
      onActive: ({x, y}) => {
        const travelX = center.x - x;
        const travelY = center.y - y;
        const isTravelingRight = travelX < 0;
        const isTravelingBottom = travelY < 0;

        const maxTravelX = window.width / 2 - INITIAL_SIZE / 2;
        const maxTravelY = window.height / 2 - INITIAL_SIZE / 2;

        rx.current =
          (isTravelingRight ? -1 : 1) * travelX > maxTravelX
            ? (isTravelingRight ? -1 : 1) * maxTravelX
            : travelX;
        ry.current =
          (isTravelingBottom ? -1 : 1) * travelY > maxTravelY
            ? (isTravelingBottom ? -1 : 1) * maxTravelY
            : travelY;
      },
      onEnd: ({velocityX, velocityY}) => {
        runSpring(rx, 0, Spring.Gentle({velocity: velocityX}));
        runSpring(ry, 0, Spring.Gentle({velocity: velocityY}));
      },
    },
    [center, window],
  );

  return (
    <Animated.View
      style={{flex: 1}}
      entering={SlideInDown.springify().damping(100).stiffness(1000)}>
      <Canvas
        style={{
          flex: 1,
        }}
        onTouch={touchHandler}>
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
