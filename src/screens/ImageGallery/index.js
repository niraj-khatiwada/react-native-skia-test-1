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
import {FlatList} from 'react-native-gesture-handler';

import {useWindowDimension} from '../../tools/hooks';

const Item = ({item}) => {
  const {window} = useWindowDimension();
  const image = useImage(item?.url);

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

  const gesturePinch = Gesture.Pinch()
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

  const gestureDoubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(evt => {
      sharedFocalX.value = withTiming(evt?.absoluteX);
      sharedFocalY.value = withTiming(evt?.absoluteY);
      sharedScale.value = withTiming(sharedScale.value == 1 ? 3 : 1);
    });
  return (
    <GestureDetector gesture={gesturePinch}>
      <GestureDetector gesture={gestureDoubleTap}>
        <Animated.View style={{flex: 1, width: window.width}}>
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
    </GestureDetector>
  );
};

function Main() {
  const {window} = useWindowDimension();

  return (
    <FlatList
      horizontal
      pagingEnabled
      snapToInterval={window.width}
      decelerationRate="fast"
      data={[
        {
          id: '1',
          url: 'https://images.pexels.com/photos/10931575/pexels-photo-10931575.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        },
        {
          id: '2',
          url: 'https://images.pexels.com/photos/11485895/pexels-photo-11485895.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        },
        {
          id: '3',
          url: 'https://images.pexels.com/photos/10990037/pexels-photo-10990037.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
        },
      ]}
      renderItem={({item}) => <Item item={item} />}
      keyExtractor={item => item?.id}
    />
  );
}

export default Main;
