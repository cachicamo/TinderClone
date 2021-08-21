import React, {useState, useEffect} from 'react'
import {Text, View, ImageBackground} from 'react-native';
import {Storage} from 'aws-amplify';

import styles from './styles';

const Card = props => {
  const {image, name, bio} = props.user;
  const [imageUrl, setImageUrl] = useState(image)

  useEffect(() => {
    if (!image) {
      return;
    }
    if (!image.startsWith('http')) {
      Storage.get(image).then(setImageUrl);
    } else {
      setImageUrl(image);
    }
  }, [image]);

  return (
    <View style={styles.card}>
      <ImageBackground
        source={{
          uri: imageUrl,
        }}
        style={styles.image}>
        <View style={styles.cardInner}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.bio}>{bio}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Card;
