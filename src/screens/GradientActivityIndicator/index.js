import {Button} from 'react-native';
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
import {SafeAreaView} from 'react-native-safe-area-context';

import {useWindowDimension} from '../../tools/hooks';

function GradientActivityIndicator() {
  const {window} = useWindowDimension();
  const [isDefaultMode, setIsDefaultMode] = React.useState(true);

  const strokeOuter = useTiming(
    {
      from: 0,
      to: 150,
      loop: true,
      yoyo: true,
    },
    {duration: 800},
  );
  const strokeInner = useTiming(
    {from: 120, to: 0, loop: true, yoyo: true},
    {duration: 800},
  );

  const progress = useTiming(
    {from: 0, to: 360, loop: true, yoyo: true},
    {
      duration: 50000,
    },
  );

  const transform = useDerivedValue(
    () => [{rotate: mix(progress.current, -Math.PI / 2, 0)}],
    [progress],
  );

  const handleToggle = () => {
    setIsDefaultMode(previousState => !previousState);
  };

  const center = React.useMemo(
    () => ({x: window.width / 2, y: window.height / 2}),
    [window],
  );

  return (
    <>
      <Canvas
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <Group origin={center} {...(isDefaultMode ? {transform} : {})}>
          <Circle
            r={isDefaultMode ? 120 : strokeOuter}
            cx={center.x}
            cy={center.y}
            color="green"
            strokeWidth={2}>
            <SweepGradient
              colors={['#93BB92', '#3EC9F4', 'magenta', 'red', 'white', 'red']}
              c={vec(window.width / 2, window.width / 2 + 20)}
            />
          </Circle>
          <Circle
            r={isDefaultMode ? 100 : strokeInner}
            cx={center.x}
            cy={center.y}
            color="white"
            strokeWidth={2}
          />
        </Group>
      </Canvas>
      <Button title="Toggle Mode" onPress={handleToggle} />
    </>
  );
}

function Main() {
  return (
    <SafeAreaView style={{flex: 1}} edges={['bottom']}>
      <GradientActivityIndicator />
    </SafeAreaView>
  );
}
export default Main;
