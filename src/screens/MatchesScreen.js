import React, {useState, useEffect, useRef} from 'react'
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
  const [matches, setMatches] = useState([]);
  const me = useRecoilValue(meState);
  const [rerender, setRerender] = useState(0);
  const flatListRef = useRef();

  const clearFlatList = () => {
      // use current
      // console.log(flatListRef.current);
      // .current.scrollToOffset({ animated: true, offset: 0 })
  }

  const renderItem = ({item}) => <MessageListItem message={item} />;

  const renderMatches = ({item}) => {
    let renderThis = null;
    if (item.user1 ) {
      renderThis = (
        <>
          <Pressable
            onPress={() =>
              onMatchPressed(me.id === item.user1.id ? item.user2 : item.user1)
            }
            key={item.id}
            style={styles.matchUserContainer}>
            {item.user1.id !== me.id && (
              <Image source={{uri: item.user1.image}} style={styles.image} />
            )}
            {item.user1.id !== me.id && (
              <Text style={styles.userOthersText}>{item.user1.name}</Text>
            )}
            {item.user2.id !== me.id && (
              <Image source={{uri: item.user2.image}} style={styles.image} />
            )}
            {item.user2.id !== me.id && (
              <Text style={styles.userOthersText}>{item.user2.name}</Text>
            )}
          </Pressable>
        </>
      );
    } else {
      renderThis = (
        <>
          <Pressable onPress={() => clearFlatList()} key={item.id} style={styles.matchUserContainer}>
            <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png'}} style={styles.image} />
            <Text style={styles.userOthersText}>New</Text>
          </Pressable>
        </>
      );
    }
    return renderThis;
  };

  // <Text>YES</Text>;

  const onMatchPressed = item => {
    navigation.navigate('UserDetails', {user: item});
  };

  const goFetch = () => {
    console.log.apply('go fetch')
  };

  const fetchMatches = async () => {
    // console.log('fetching Matches')
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

  useEffect(() => {
    // console.log('useEffect 1')
    if (!me) {
      return;
    }

    fetchMatches();
  }, []);

  useEffect(() => {
    // console.log('useEffect 2')
    try {
      const subscription = DataStore.observe(Match).subscribe(msg => {
        // console.log(msg.model, msg.opType);
        // console.warn(msg.model, msg.opType, msg.element);
        if (msg.opType === 'UPDATE' ) {
          const newMatch = msg.element;
          // console.log('new Match update operation');
          if (
            newMatch.isMatch &&
            (msg.element.User1ID === me.id || msg.element.User2ID === me.id)
          ) {
            // console.log('**************** There is a new match waiting for you!');
            setRerender(rerender+1);
          }
        }
      });
    } catch (e) {
      console.error(e);
    }

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // console.log('useEffect 3')
    if (!me) {
      return;
    }
    fetchMatches();
  }, [rerender, fetchMatches]);

  return (
    <SafeAreaView style={styles.root}>
      <NavigationIcons navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.title}>New Matches</Text>
        <View style={styles.matchedUsers}>
          <View style={styles.userContainer}>
            <Image source={{uri: me.image}} style={styles.image} />
            <Text style={styles.userText}>{matches.length} Likes</Text>
          </View>
          <FlatList
            style={styles.matchesFlatList}
            data={matches}
            ref={flatListRef}
            renderItem={renderMatches}
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
  },
  container: {
    height: 160,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f63a6b',
  },
  userContainer: {
    width: 65,
    height: 65,
    margin: 5,
    borderRadius: 50,
    alignItems: 'center',

    borderWidth: 3,
    padding: 3,
    borderColor: '#f63a6b',
  },
  matchUserContainer: {
    width: 65,
    height: 65,
    margin: 3,
    borderRadius: 50,
    alignItems: 'center',
  },
  matchedUsers: {
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
    height: 120,
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
