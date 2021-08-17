import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import Amplify, {DataStore, Hub} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react-native';
import config from './src/aws-exports';

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Matches" component={MatchesScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default withAuthenticator(App);
