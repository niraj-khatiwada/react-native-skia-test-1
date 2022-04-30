import {View} from 'react-native';
import React from 'react';
import {
  Canvas,
  Circle,
  SweepGradient,
  Group,
  vec,
  useTiming,
  useDerivedValue,
  Easing,
  mix,
} from '@shopify/react-native-skia';
import useWindowDimensions from './src/tools/useWindowDimension';

export default function App() {
  const {window} = useWindowDimensions();
  const strokeOuter = useTiming(
    {
      from: 0,
      to: 150,
      loop: true,
      yoyo: true,
    },
    {duration: 2000},
  );
  const strokeInner = useTiming(
    {from: 0, to: 150, loop: true, yoyo: true},
    {duration: 2000},
  );
  const progress = useTiming(
    {from: 0, to: 360, loop: true, yoyo: true},
    {
      duration: 60000,
      easing: Easing.inOut(Easing.ease),
    },
  );

  const transform = useDerivedValue(
    () => [{rotate: mix(progress.current, -Math.PI / 2, 0)}],
    [progress],
  );

  return (
    <View style={{flex: 1}}>
      <Canvas
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <Group
          origin={{x: window.width / 2, y: window.height / 2}}
          transform={transform}>
          <Circle
            // r={strokeOuter}
            r={120}
            cx={window.width / 2}
            cy={window.height / 2}
            color="green"
            strokeWidth={2}
            strokeCap="round">
            <SweepGradient
              colors={['#93BB92', '#3EC9F4', 'magenta', 'red', 'white', 'red']}
              c={vec(window.width / 2, window.width / 2 + 20)}
            />
          </Circle>
          <Circle
            // r={strokeInner}
            r={100}
            cx={window.width / 2}
            cy={window.height / 2}
            color="white"
            strokeWidth={2}
          />
        </Group>
      </Canvas>
    </View>
  );
}
