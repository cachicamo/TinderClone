import 'react-native-gesture-handler';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import users from '../../assets/data/users';
import Card from '../components/TinderCard';
import AnimatedStack from '../components/AnimatedStack';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

const HomeScreen = () => {
  const onSwipeLeft = user => {
    console.warn('swipe Left: ', user.name);
  };

  const onSwipeRight = user => {
    console.warn('swipte Right: ', user.name);
  };

  return (
    <View style={styles.pageContainer}>
      <AnimatedStack
        data={users}
        renderItem={({item}) => <Card user={item} />}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
      />
      <View style={styles.icons}>
        <View style={styles.circle}>
          <FontAwesome name="undo" size={24} color="#FBD88B" />
        </View>
        <View style={styles.circle}>
          <Entypo name="cross" size={24} color="#F76C6B" />
        </View>
        <View style={styles.circle}>
          <FontAwesome name="star" size={24} color="#3AB4CC" />
        </View>
        <View style={styles.circle}>
          <FontAwesome name="heart" size={24} color="#4FCC94" />
        </View>
        <View style={styles.circle}>
          <Ionicons name="flash" size={24} color="#A65CD2" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f4f4f4',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
