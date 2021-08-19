import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

import NavigationIcons from '../components/NavigationIcons';

const UserDetailsScreen = ({navigation, user}) => {

  console.log(user)
  return (
    <SafeAreaView style={styles.root}>
      <NavigationIcons navigation={navigation} />
      <View style={styles.contentContainer}>
        <Text>Details</Text>
        {/* <Text>{user.name}</Text> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create ({
  root: {
    width: '100%',
    flex: 1,
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserDetailsScreen;
