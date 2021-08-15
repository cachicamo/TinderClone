import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '70%',
    borderRadius: 10,
    backgroundColor: '#eefefe',
    
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',

    justifyContent: 'flex-end', // moves text to bottom of image
  },
  cardInner: {
    padding: 10,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  bio: {
    fontSize: 18,
    color: 'white',
    lineHeight: 25,
  },
});

export default styles;
