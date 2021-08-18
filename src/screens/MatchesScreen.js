import React, {useState, useEffect} from 'react'
import { View, Image, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native'
import {DataStore} from 'aws-amplify';
import {useRecoilValue} from 'recoil';

import {meState, allMatchesState} from '../atoms/index';

import {Match} from '../models';

// mock data
import users from '../../assets/data/users';
import messages from '../../assets/data/messages';

import MessageListItem from '../components/MessageListItem';
import NavigationIcons from '../components/NavigationIcons';

const MatchesScreen = ({navigation}) => {
  const me = useRecoilValue(meState);
  const [matches, setMatches] = useState([]);

  const renderItem = ({item}) => <MessageListItem message={item} />;

  useEffect(() => {
    const fetchMatches = async () => {
      const result = await DataStore.query(Match, match =>
        match.User2ID('eq', me.id).isMatch('eq', true),
      );

      setMatches(result);
    };

    fetchMatches();
  }, [me]);



  if (!me) {
    return null;
  }
  console.log("Match ",matches)

  return (
    <SafeAreaView style={styles.root}>
      <NavigationIcons navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.title}>New Matches</Text>
        <View style={styles.users}>
          <View style={styles.user}>
            <Image source={{uri: me.image}} style={styles.image} />
            <Text style={styles.userText}>{me.likes}{' '}Likes</Text>
          </View>
          {users.map((user, i) => (
            <View key={i} style={styles.userOthers}>
              <Image source={{uri: user.image}} style={styles.image} />
              <Text style={styles.userOthersText}>{user.name.split(' ')[0]}</Text>
            </View> 
          ))}
        </View>
      </View>
      <View style={styles.messageContainer}>
        <Text style={styles.titleMessage}>Messages</Text>
        <FlatList
          style={styles.flatList}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
        />
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
  container: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f63a6b',
  },
  user: {
    width: 65,
    height: 65,
    margin: 5,
    borderRadius: 50,
    alignItems: 'center',

    borderWidth: 3,
    padding: 3,
    borderColor: '#f63a6b',

  },
  userOthers: {
    width: 65,
    height: 65,
    margin: 5,
    borderRadius: 50,
    alignItems: 'center',
  },
  users: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  userText: {
    marginVertical: 15,
  },
  userOthersText: {
    marginVertical: 10,
  },
  messageContainer: {
    paddingTop: 15,
    paddingLeft: 15,
    marginVertical: 15,
    height: '70%',
  },
  titleMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f63a6b',
  },
  flatList: {
    padding: 5,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 25,
    width: '100%',
    height: 70,
    // backgroundColor: 'red',
  },
});

export default MatchesScreen;
