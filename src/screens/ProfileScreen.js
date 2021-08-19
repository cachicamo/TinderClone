import React, {useState, useEffect} from 'react'
import {Auth, DataStore} from 'aws-amplify';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import {useRecoilState} from 'recoil';

import {CommonActions} from '@react-navigation/native';
import {Picker} from '@react-native-community/picker';

import NavigationIcons from '../components/NavigationIcons';
import {User} from '../models/';
import {isUsersLoadingState} from '../atoms/index';

const ProfileScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);
  const [bio, setBio] = useState(null);
  const [gender, setGender] = useState('MALE');
  const [lookingFor, setLookingFor] = useState('FEMALE');
  const [isUserLoading, setIsUserLoading] = useRecoilState(isUsersLoadingState);


  const signOut = async () => {
    await DataStore.clear();
    setIsUserLoading(false);
    Auth.signOut();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );
  };

  const isValid = () => {
    return name && bio && gender && lookingFor;
  };

  const save = async () => {
    if (!isValid()) {
      console.warn('Not Valid');
      return;
    }

    try {
      if (user) {
        // Update existing user
        if (
          user.name !== name ||
          user.bio !== bio ||
          user.gender !== gender ||
          user.lookingFor !== lookingFor
        ) {
          await DataStore.save(
            User.copyOf(user, updated => {
              updated.name = name;
              updated.bio = bio;
              updated.gender = gender;
              updated.lookingFor = lookingFor;
            }),
          );
        } else {
          Alert.alert('No Changes Detected!');
          return;
        }
      } else {
        // create a new user in database
        const usr = await Auth.currentAuthenticatedUser();
        const newUser = new User({
          sub: usr.attributes.sub,
          name,
          bio,
          gender,
          lookingFor,
          image:
            'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png',
        });
        await DataStore.save(newUser);
      }

      Alert.alert('User Saved Successfully!');
    } catch (e) {
      console.error(e);
    }

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();

        const dbUsers = await DataStore.query(User, u =>
          u.sub('eq', authUser.attributes.sub),
        );
        if (!dbUsers || dbUsers.length === 0) {
          return;
        }
        const dbUser = dbUsers[0];
        setUser(dbUser);
        setName(dbUser.name);
        setBio(dbUser.bio);
        setGender(dbUser.gender);
        setLookingFor(dbUser.lookingFor);
      } catch (e) {
        console.error(e);
      }
    };

    getCurrentUser();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.pageContainer}>
        <NavigationIcons navigation={navigation} activeScreen={'PROFILE'} />
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Name..."
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Bio..."
            multiline={true}
            scrollEnabled = {true}
            maxLength={105}
            value={bio}
            onChangeText={setBio}
          />
          <Text style={styles.pickerTitle}>Gender</Text>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
            prompt="Gender">
            <Picker.Item label="Male" value="MALE" />
            <Picker.Item label="Female" value="FEMALE" />
            <Picker.Item label="Other" value="OTHER" />
          </Picker>

          <Text style={styles.pickerTitle}>Looking For</Text>
          <Picker
            selectedValue={lookingFor}
            onValueChange={(itemValue, itemIndex) => setLookingFor(itemValue)}>
            <Picker.Item label="Male" value="MALE" />
            <Picker.Item label="Female" value="FEMALE" />
            <Picker.Item label="Other" value="OTHER" />
          </Picker>

          <Pressable onPress={save} style={styles.saveBtn}>
            <Text style={styles.saveText}>Save</Text>
          </Pressable>

          <Pressable onPress={signOut} style={styles.signOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
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
    width: '100%',
    backgroundColor: '#f4f4f4',
  },
  container: {
    padding: 10,
    height: '92%',
  },
  signOut: {
    height: 25,
    marginTop: 15,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'lightgrey',
  },
  signOutText: {
    fontSize: 18,
  },
  input: {
    marginHorizontal: 10,
    paddingTop: 15,
    fontSize: 18,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 2,
  },
  saveBtn: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 0,
    backgroundColor: 'lightgreen',
  },
  saveText: {
    fontSize: 18,
  },
  pickerTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
