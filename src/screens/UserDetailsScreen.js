import React from 'react';
import {View, Text, Image, StyleSheet, SafeAreaView} from 'react-native';
import {useRoute} from '@react-navigation/native';

import NavigationIcons from '../components/NavigationIcons';

const UserDetailsScreen = ({navigation}) => {
  const route = useRoute();
  const {user} = route.params;

  return (
    <SafeAreaView style={styles.root}>
      <NavigationIcons navigation={navigation} />
      <View style={styles.contentContainer}>
        <Image source={{uri: user.image}} style={styles.image} />
        <View style={styles.text}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userBio}>{user.bio}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create ({
  root: {
    width: '100%',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  image: {
    height: '75%',
    borderRadius: 50,
    margin: 5,
  },
  text: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    paddingHorizontal: 10,
    paddingRight: 15,
  },
  userName: {
    fontSize: 28,
  },
  userBio: {
    fontSize: 22,
  },
});

export default UserDetailsScreen;
