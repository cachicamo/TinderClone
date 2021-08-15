import React, {useState} from 'react';
import { View, SafeAreaView, StyleSheet, Pressable } from 'react-native';

import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

import HomeScreen from './src/screens/HomeScreen';
import MatchesScreen from './src/screens/MatchesScreen';

const App = () => {
  const [activeScreen, setActiveScreen] = useState('HOME');
  const color = "#b5b5b5";
  const activeColor = "#f76c6b"
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.pageContainer}>
        <View style={styles.topNavigation}>
          <Pressable onPress={() => setActiveScreen('HOME')}>
            <Fontisto name="tinder" size={30} color={activeScreen === 'HOME' ? activeColor : color} />
          </Pressable>
          <Pressable>
            <MaterialCommunityIcons
              name="star-four-points"
              size={30}
              color={color}
            />
          </Pressable>

          <Pressable onPress={() => setActiveScreen('CHAT')}>
            <Ionicons name="ios-chatbubbles" size={30} color={activeScreen === 'CHAT' ? activeColor : color} />
          </Pressable>
          <Pressable>
            <FontAwesome name="user" size={30} color={color} />
          </Pressable>
        </View>
      </View>
      
      { activeScreen === 'HOME' && <HomeScreen />}
      { activeScreen === 'CHAT' && <MatchesScreen />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  pageContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
  },
});

export default App;
