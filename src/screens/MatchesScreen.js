import React, {useState, useEffect} from 'react'
import { View, Image, Text, StyleSheet, SafeAreaView, FlatList, Pressable, ActivityIndicator } from 'react-native'
import {DataStore, Hub} from 'aws-amplify';
import {useRecoilValue, useRecoilState} from 'recoil';

import {meState, isUsersLoadingState} from '../atoms/index';

import {Match} from '../models';

// mock data
// import users from '../../assets/data/users';
import messages from '../../assets/data/messages';

import MessageListItem from '../components/MessageListItem';
import NavigationIcons from '../components/NavigationIcons';


const MatchesScreen = ({navigation}) => {
  const me = useRecoilValue(meState);
  const [isUserLoading, setIsUserLoading] = useRecoilState(isUsersLoadingState);

  const [matches, setMatches] = useState([]);

  const renderItem = ({item}) => <MessageListItem message={item} />;
  const onMatchPressed = item => {
    navigation.navigate('UserDetails', {user: item});
  };

  useEffect(() => {
    if (!me) {
      return;
    }
    const fetchMatches = async () => {
      try {
        const result = await DataStore.query(Match, m =>
          m
            .isMatch('eq', true)
            .or(n => n.User2ID('eq', me.id).User1ID('eq', me.id)),
        );

        setMatches(result);
      } catch (e) {
        console.error(e);
      }
    };

    fetchMatches();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <NavigationIcons navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.title}>New Matches</Text>
        <View style={styles.users}>
          <View style={styles.user}>
            <Image source={{uri: me.image}} style={styles.image} />
            <Text style={styles.userText}>{matches.length} Likes</Text>
          </View>
          <FlatList
            style={styles.matchesFlatList}
            data={matches}
            renderItem={({item}) => (
              <Pressable
                onPress={() =>
                  onMatchPressed(
                    me.id === item.user1.id ? item.user2 : item.user1,
                  )
                }
                key={item.id}
                style={styles.userOthers}>
                {item.user1.id !== me.id && (
                  <Image
                    source={{uri: item.user1.image}}
                    style={styles.image}
                  />
                )}
                {item.user1.id !== me.id && (
                  <Text style={styles.userOthersText}>{item.user1.name}</Text>
                )}
                {item.user2.id !== me.id && (
                  <Image
                    source={{uri: item.user2.image}}
                    style={styles.image}
                  />
                )}
                {item.user2.id !== me.id && (
                  <Text style={styles.userOthersText}>{item.user2.name}</Text>
                )}
              </Pressable>
            )}
            // {renderMatch}
            keyExtractor={(item, index) => index}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
          />
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
    margin: 3,
    borderRadius: 50,
    alignItems: 'center',

  },
  users: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#c1c1c1'
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
    paddingTop: 5,
    paddingLeft: 15,
    height: '64%',
  },
  titleMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f63a6b',
  },
  flatList: {
    padding: 5,
  },
  matchesFlatList: {
    flexDirection: 'row',
    height: 100,
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
