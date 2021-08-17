import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {Auth, DataStore} from 'aws-amplify';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

// User DataStore Definition
import {User} from '../models/';

// Local mock data
// import users from '../../assets/data/users';

import Card from '../components/TinderCard';
import AnimatedStack from '../components/AnimatedStack';
import NavigationIcons from '../components/NavigationIcons';

const HomeScreen = ({navigation}) => {
  const [authUser, setAuthUser] = useState(null);
  const [usersDB, setUsersDB] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);

  const onSwipeLeft = () => {
    if (!currentCard) {
      return;
    }
    console.log('swipe Left: ', currentCard.name);
  };

  const onSwipeRight = () => {
    if (!currentCard) {
      return;
    }
    console.log('swipte Right: ', currentCard.name);
  };

  useEffect(() => {
    const getAuthUser = async () => {
      try {
        const response = await Auth.currentAuthenticatedUser();
        setAuthUser(response);
      } catch (e) {
        console.error(e);
      }
    };

    getAuthUser();
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const dbUsers = await DataStore.query(User);
        setUsersDB(dbUsers);
      } catch (e) {
        console.error(e);
      }
    };

    getUsers();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.pageContainer}>
        <NavigationIcons navigation={navigation} />
        <AnimatedStack
          data={usersDB}
          renderItem={({item}) => <Card user={item} />}
          onSwipeLeft={onSwipeLeft}
          onSwipeRight={onSwipeRight}
          setCurrentCard={setCurrentCard}
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
});

export default HomeScreen;
