import React from 'react'
import {Text, View, ImageBackground} from 'react-native';

import styles from './styles';

const Card = props => {
  const {image, name, bio} = props.user;

  return (
    <View style={styles.card}>
      <ImageBackground
        source={{
          uri: image,
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
