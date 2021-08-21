import React, {useEffect, useRef} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {DataStore} from 'aws-amplify';
import {useRecoilState, useRecoilValue} from 'recoil';
import {S3Image} from 'aws-amplify-react-native';

import {meState, matchesState} from '../atoms/index';

import {Match} from '../models';

// mock data
// import users from '../../assets/data/users';
import messages from '../../assets/data/messages';

import MessageListItem from '../components/MessageListItem';
import NavigationIcons from '../components/NavigationIcons';

const MatchesScreen = ({navigation}) => {
  const me = useRecoilValue(meState);
  const [matches, setMatches] = useRecoilState(matchesState);
  const flatListRef = useRef();

  const clearFlatList = () => {
    console.warn('blank image')
      // console.log(flatListRef.current);
      // .current.scrollToOffset({ animated: true, offset: 0 })
  }

  const renderItem = ({item}) => <MessageListItem message={item} />;

  const renderImage = (item) => {
    // console.log(item)
    if (item.image.startsWith('http')) {
      return <Image source={{uri: item.image}} style={styles.image} />
    }
    return <S3Image imgKey={item.image} style={styles.image} />;
  };

  const renderMatches = ({item, index}) => {
    let renderThis = null;
    if (item.user1 ) {
      renderThis = (
        <>
          <Pressable
            onPress={() =>
              onMatchPressed(me.id === item.user1.id ? item.user2 : item.user1)
            }
            key={item.id}
            style={
              index === 0 ? styles.newMatchContainer : styles.matchUserContainer
            }>
            {item.user1.id !== me.id ? renderImage(item.user1) : null}
            {/* (
              <Image source={{uri: item.user1.image}} style={styles.image} />
            )} */}
            {item.user1.id !== me.id && index === 0 && (
              <Text style={styles.userText}>{item.user1.likes} Likes</Text>
            )}
            {item.user1.id !== me.id && index > 0 && (
              <Text style={styles.userOthersText}>{item.user1.name}</Text>
            )}
            {item.user2.id !== me.id ? renderImage(item.user2) : null}
            {/* {item.user2.id !== me.id && (
              <Image source={{uri: item.user2.image}} style={styles.image} />
            )} */}
            {item.user2.id !== me.id && index === 0 && (
              <Text style={styles.userText}>{item.user2.likes} Likes</Text>
            )}
            {item.user2.id !== me.id && index > 0 && (
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

  const onMatchPressed = item => {
    navigation.navigate('UserDetails', {user: item});
  };

  const fetchMatches = async () => {
    try {
      console.log('Fetch Matches again')
      const result = await DataStore.query(Match, m =>
        m
          .isMatch('eq', true)
          .or(n => n.User2ID('eq', me.id).User1ID('eq', me.id)),
      );

      const result2 = result.sort((a, b) => {
        return a._lastChangedAt + b._lastChangedAt;
      });

      setMatches(result2);
    } catch (e) {
      console.error(e);
    }
  };

  // subscribe to Match events
  useEffect(() => {
    console.log('Subscribed to Matches Events');
    const subscription = DataStore.observe(Match).subscribe(msg => {
      // console.warn(msg.model, msg.opType, msg.element);
      console.log(msg.opType);
      if (msg.opType === 'UPDATE') {
        const newMatch = msg.element;
        if (
          newMatch.isMatch &&
          (msg.element.User1ID === me.id || msg.element.User2ID === me.id)
        ) {
          fetchMatches();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <NavigationIcons navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.title}>New Matches</Text>
        <View style={styles.matchedUsers}>
         
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
  newMatchContainer: {
    width: 75,
    height: 75,
    margin: 5,
    borderRadius: 50,
    alignItems: 'center',

    borderWidth: 3,
    padding: 3,
    borderColor: '#f63a6b',
  },
  matchUserContainer: {
    width: 75,
    height: 75,
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
