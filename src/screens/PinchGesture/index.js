import React, {useEffect} from 'react';
import {
  Canvas,
  useSharedValueEffect,
  useValue,
  Group,
  useDerivedValue,
  Image,
  useImage,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  withSequence,
  withSpring,
  SlideInDown,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';

import {useWindowDimension} from '../../tools/hooks';

const MyComponent = () => {
  const {window} = useWindowDimension();
  const image = useImage(
    'https://images.pexels.com/photos/10931575/pexels-photo-10931575.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  );

  const center = React.useMemo(
    () => ({
      x: window.width / 2,
      y: window.height / 2,
    }),
    [window],
  );

  const radius = useValue(20);
  const xRR = useValue(1);
  const scale = useValue(1);
  const shared = useSharedValue(1);
  const sharedScale = useSharedValue(1);

  const focalX = useValue(center.x);
  const focalY = useValue(center.y);
  const sharedFocalX = useSharedValue(center.x);
  const sharedFocalY = useSharedValue(center.y);

  useEffect(() => {
    shared.value = withSequence(withSpring(0.3), withSpring(1));
  }, [shared]);

  useSharedValueEffect(
    () => {
      xRR.current = shared.value;
      radius.current = shared.value * 100;
      scale.current = sharedScale.value;
    },
    shared,
    sharedScale,
  );

  useSharedValueEffect(
    () => {
      focalX.current = sharedFocalX.value;
      focalY.current = sharedFocalY.value;
    },
    sharedFocalX,
    sharedFocalY,
  );
  const transform = useDerivedValue(
    () => [
      {translateX: -center.x + focalX.current},
      {translateY: -center.y + focalY.current},
      {scale: scale.current},
      {translateX: center.x - focalX.current},
      {translateY: center.y - focalY.current},
    ],
    [xRR, scale, focalX, focalY, center],
  );

  const transformFocalPoint = useAnimatedStyle(
    () => ({
      transform: [
        {translateX: sharedFocalX.value},
        {translateY: sharedFocalY.value},
      ],
    }),
    [sharedFocalX, sharedFocalY],
  );

  const gesture = Gesture.Pinch()
    .onStart(evt => {
      sharedFocalX.value = evt?.focalX;
      sharedFocalY.value = evt?.focalY;
    })
    .onUpdate(evt => {
      sharedScale.value = evt?.scale;
      // TODO: Need to figure out why the focal point changes randomly sometimes. Uncomment below to test. The drag to move is disabled for this reason
      //   sharedFocalX.value = evt?.focalX;
      //   sharedFocalY.value = evt?.focalY;
    })
    .onEnd(() => {
      sharedScale.value = withTiming(1, {duration: 300});
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={{flex: 1}}
        entering={SlideInDown.springify().damping(100).stiffness(200)}>
        <Canvas
          style={{
            flex: 1,
          }}>
          <Group transform={transform} origin={center}>
            {image ? (
              <Image
                image={image}
                width={window.width}
                height={window.height}
                fit="contain"
                x={center.x - window.width / 2}
                y={center.y - window.height / 2}
              />
            ) : null}
          </Group>
        </Canvas>
        {/* Focal Point */}
        <Animated.View
          style={[
            {
              width: 10,
              height: 10,
              borderRadius: 10,
              backgroundColor: 'green',
            },
            transformFocalPoint,
          ]}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default MyComponent;
