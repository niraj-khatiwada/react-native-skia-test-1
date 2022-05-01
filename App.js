import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import AppNavigator from './src/navigators/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer fallback={null}>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
