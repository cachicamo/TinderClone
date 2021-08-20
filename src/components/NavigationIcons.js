import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useRecoilValue} from 'recoil';
import {meState} from '../atoms/index';

import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const NavigationIcons = ({navigation}) => {
  const me = useRecoilValue(meState);
  const color = '#b5b5b5';
  const activeColor = '#f76c6b';
  const route = useRoute();

  return (
    <View style={styles.topNavigation}>
      <Pressable onPress={() => navigation.navigate('Home')}>
        <Fontisto
          name="tinder"
          size={30}
          color={route.name === 'Home' ? activeColor : color}
        />
      </Pressable>
      <Pressable>
        <MaterialCommunityIcons
          name="star-four-points"
          size={30}
          color={color}
        />
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Matches')}>
        <Ionicons
          name="ios-chatbubbles"
          size={30}
          color={route.name === 'Matches' ? activeColor : color}
        />
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('Profile')}
        style={styles.user}>
        <FontAwesome
          name="user"
          size={30}
          color={route.name === 'Profile' ? activeColor : color}
        />
        <Text>{me.name}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
  user: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});


export default NavigationIcons;
