import React from 'react'
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

import NavigationIcons from '../components/NavigationIcons';

const ProfileScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.pageContainer}>
        <NavigationIcons navigation={navigation} activeScreen={'PROFILE'} />
        <View style={styles.container}>
          <Text>Profile Screen</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
    padding: 10,
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f4f4f4',
  },
  container: {
    padding: 15,
    height: '92%',
  },
});

export default ProfileScreen
