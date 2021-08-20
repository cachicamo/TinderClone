import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {Auth, DataStore, Hub} from 'aws-amplify';
import {View, StyleSheet, SafeAreaView, Pressable, ActivityIndicator} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import {useRecoilState, useRecoilValue} from 'recoil';
import {CommonActions} from '@react-navigation/native';

//Recoil
import {meState, userDBState, currentCardState} from '../atoms/index';

// User DataStore Definition
import {User, Match} from '../models/';

// Local mock data
// import users from '../../assets/data/users';

import Card from '../components/TinderCard';
import AnimatedStack from '../components/AnimatedStack';
import NavigationIcons from '../components/NavigationIcons';
import {isUsersLoadingState} from '../atoms/index';


const HomeScreen = ({navigation}) => {
  const [me, setMe] = useRecoilState(meState);
  const [usersDB, setUsersDB] = useRecoilState(userDBState);
  const currentCard = useRecoilValue(currentCardState);
  const [isUserLoading, setIsUserLoading] = useRecoilState(isUsersLoadingState);

  const getCurrentUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const dbUsers = await DataStore.query(User, u =>
        u.sub('eq', user.attributes.sub),
      );
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }

      setMe(dbUsers[0]);
    } catch (e) {
      console.error(e);
    }
  };

  const getUsers = async () => {
    if (!me) {
      return;
    }
    try {
      const dbUsers = await DataStore.query(User);
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }

      setUsersDB(dbUsers);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, [isUserLoading]);

  useEffect(() => {
    getUsers();
  }, [me]);

  useEffect(() => {
    // Create listener
    const listener = Hub.listen('datastore', async hubData => {
      const {event, data} = hubData.payload;
      if (event === 'modelSynced' && data?.model?.name === 'User') {
        console.log('User Model has finished syncing');
        setIsUserLoading(false);
      }
    });

    return () => listener();
  }, []);

  const onSwipeLeft = () => {
    if (!currentCard || !me) {
      return;
    }
    // console.log('swipe Left: ', currentCard.name);
  };

  const onSwipeRight = async () => {
    if (!currentCard || !me) {
      return;
    }

    try {
      const myMatches = await DataStore.query(Match, match =>
        match.User1ID('eq', me.id).User2ID('eq', currentCard.id),
      );

      if (myMatches.length > 0) {
        // console.warn('You already swipped right to this user');
        return;
      }

      const hisMatches = await DataStore.query(Match, match =>
        match.User1ID('eq', currentCard.id).User2ID('eq', me.id),
      );

      if (hisMatches.length > 0) {
        // console.warn('Yay, this is a new match');
        const hisMatch = hisMatches[0];
        DataStore.save(
          Match.copyOf(hisMatch, updated => (updated.isMatch = true)),
        );
        return;
      }

      // console.warn('Sending User a match request!');
      const newMatch = new Match({
        User1ID: me.id,
        User2ID: currentCard.id,
        isMatch: false,
      });
      DataStore.save(newMatch);
    } catch (e) {
      console.error(e);
    }
  };

  // Reload UsersDB
  const onRefresh = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );
  };

  if (isUserLoading && !usersDB) {
    return <ActivityIndicator style={{flex: 1}} />;
  }

  if (!me || !usersDB) {
    return null;
  }

  const users = usersDB.filter(db => db.id !== me.id);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.pageContainer}>
        <NavigationIcons navigation={navigation} />
        <AnimatedStack
          data={users}
          renderItem={({item}) => <Card user={item} />}
          onSwipeLeft={onSwipeLeft}
          onSwipeRight={onSwipeRight}
        />
        <Pressable onPress={onRefresh} style={styles.icons}>
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
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
  meNameContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  meName: {
    fontSize: 12,
  },
});

export default HomeScreen;
