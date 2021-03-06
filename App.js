import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Amplify, {DataStore, Hub} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react-native';
import {RecoilRoot, useRecoilState} from 'recoil';

import config from './src/aws-exports';
import HomeScreen from './src/screens/HomeScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UserDetailsScreen from './src/screens/UserDetailsScreen';

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
    <RecoilRoot>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Matches" component={MatchesScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
        </Stack.Navigator>
    </RecoilRoot>
      </NavigationContainer>
  );
};

export default withAuthenticator(App);
