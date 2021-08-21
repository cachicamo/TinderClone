import React, {useState, useEffect} from 'react'
import {Auth, DataStore, Storage} from 'aws-amplify';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  Alert,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {S3Image} from 'aws-amplify-react-native';
import {Picker} from '@react-native-community/picker';
import {request, PERMISSIONS} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';

import NavigationIcons from '../components/NavigationIcons';
import {User} from '../models/';

const ProfileScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);
  const [bio, setBio] = useState(null);
  const [gender, setGender] = useState('MALE');
  const [lookingFor, setLookingFor] = useState('FEMALE');
  const [newImageLocalUri, setNewImageLocalUri] = useState(null);

  // get photo library permissions
  useEffect(() => {
    const getPerm = async () => {
      // const usr = await Auth.currentAuthenticatedUser();
      // console.log(Platform);
      const perm =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.CAMERA;

      request(perm).then(status => {
        console.log(status);
      });
    };

    getPerm();
  }, []);

  const uploadImage = async () => {
    try {
      const response = await fetch(newImageLocalUri);

      const blob = await response.blob();

      const urlParts = newImageLocalUri.split('.');
      const extension = urlParts[urlParts.length - 1];

      const key = `${user.id}.${extension}`;

      await Storage.put(key, blob);

      return key;
    } catch (e) {
      console.log('uploadImage function')
      console.log(e);
    }
    return '';
  };

  const changeAvatar = async () => {
    try {
      const response = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
      setNewImageLocalUri(response.sourceURL);
      // });
    } catch (e) {
      console.log(e);
    };
  };

  const signOut = async () => {
    await DataStore.clear();
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
      let newImage;
      if (newImageLocalUri) {
        newImage = await uploadImage();
      }

      if (user) {
        // Update existing user
        const updatedUser = User.copyOf(user, updated => {
          updated.name = name;
          updated.bio = bio;
          updated.gender = gender;
          updated.lookingFor = lookingFor;
          if (newImage) {
            updated.image = newImage;
          }
        });

        await DataStore.save(updatedUser);
        setNewImageLocalUri(null);
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
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png',
          likes: 0,
        });
        await DataStore.save(newUser);
      }
    } catch (e) {
      console.error(e);
    }

    Alert.alert('User Saved Successfully!');

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home'}],
      }),
    );
  };

  // get current user Info from DataStore
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

  // wait for user data to load
  if (!user) {
    return null;
  }

  const renderImage = () => {
    if (newImageLocalUri) {
      return <Image source={{uri: newImageLocalUri}} style={styles.image} />;
    }
    if (user?.image.startsWith('http')) {
      return <Image source={{uri: user.image}} style={styles.image} />
    }
    return <S3Image imgKey={user.image} style={styles.image} />;
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.pageContainer}>
        <NavigationIcons navigation={navigation} activeScreen={'PROFILE'} />
        <ScrollView style={styles.container}>
          <View style={styles.avatarContainer}>
            {renderImage()}
            <View style={styles.nameContainer}>
              <Pressable onPress={signOut} style={styles.signOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </Pressable>
              <Pressable onPress={changeAvatar} style={styles.changeImageBtn}>
                <Text>Change Image</Text>
              </Pressable>

              <TextInput
                style={styles.input}
                placeholder="Name..."
                maxLength={23}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Bio..."
            multiline={true}
            scrollEnabled={true}
            maxLength={105}
            value={bio}
            onChangeText={setBio}
          />
          <Text style={styles.pickerTitle}>Gender</Text>
          <Picker
            style={styles.picker}
            selectedValue={gender}
            onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
            prompt="Gender">
            <Picker.Item label="Male" value="MALE" />
            <Picker.Item label="Female" value="FEMALE" />
            <Picker.Item label="Other" value="OTHER" />
          </Picker>

          <Text style={styles.pickerTitle}>Looking For</Text>
          <Picker
            style={styles.picker}
            selectedValue={lookingFor}
            onValueChange={(itemValue, itemIndex) => setLookingFor(itemValue)}>
            <Picker.Item label="Male" value="MALE" />
            <Picker.Item label="Female" value="FEMALE" />
            <Picker.Item label="Other" value="OTHER" />
          </Picker>
          {!(
            user.name === name &&
            user.bio === bio &&
            user.gender === gender &&
            user.lookingFor === lookingFor &&
            (newImageLocalUri !== user.image || newImageLocalUri === null) 
          ) && (
            <Pressable onPress={save} style={styles.saveBtn}>
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    flex: 1,
    margin: 17,
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '90%',
    backgroundColor: '#f4f4f4',
  },
  container: {
    padding: 10,
    height: '100%',
  },
  signOut: {
    marginLeft: 120,
    height: 25,
    width: 100,
    marginTop: 0,
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
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 10,
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  picker: {
    backgroundColor: '#f4f4e4',
    borderWidth: 1,
    borderBottomColor: '#848484'
  },
  avatarContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  changeImageBtn: {
    height: 20,
    width: 100,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    marginLeft: 5,
  },
  nameContainer: {

  },
});

export default ProfileScreen;
