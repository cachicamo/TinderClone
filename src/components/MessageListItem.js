import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

const MessageListItem = (props) => {
  const { message } = props;
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: message.image }} style={styles.image}/>
      </View>
      <View style={styles.middleContainer}>
        <Text style={styles.name}>{message.name}</Text>
        <Text>{message.message}</Text>
      </View>
      {message.count > 0 && (
        <View style={styles.rightContainer}>
          <Text style={styles.messages}>{message.count}</Text>
        </View>
      )}
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 75,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4d4',
    flexDirection: 'row',
    alignItems: 'center',

  },
  middleContainer: {
    width: '75%',
    paddingLeft: 10,
    justifyContent: 'space-around',
  },
  imageContainer: {
    borderRadius: 50,
    paddingVertical: 10,

  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  rightContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 50,
  },
  messages: {
    fontSize: 16,
    color: 'white',
  }
});

export default MessageListItem
