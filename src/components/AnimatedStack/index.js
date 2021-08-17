import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

import Like from '../../../assets/images/LIKE.png';
import Nope from '../../../assets/images/nope.png';

const ROTATION = 60;
const SWIPE_VELOCITY = 60;

const AnimatedStack = (props) => {
  const { data, renderItem, onSwipeLeft, onSwipeRight } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);
  const currentProfile = data[currentIndex];
  const nextProfile = data[nextIndex];

  const {width: screenWidth} = useWindowDimensions();

  const hiddenTranslateX = 2 * screenWidth;

  const translateX = useSharedValue(0); // values -width,   0   , +width
  const rotate = useDerivedValue(
    () =>
      interpolate(translateX.value, [0, hiddenTranslateX], [0, ROTATION]) +
      'deg',
  ); // value  -60deg , 0deg , 60deg

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      // console.warn('Touch Start');
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      // console.log('Touch x: ', event.translationX);
    },
    onEnd: event => {
      if (Math.abs(event.translationX) < SWIPE_VELOCITY) {
        translateX.value = withSpring(0);
        return;
      }

      // throw card left or right and after that change Index
      translateX.value = withSpring(
        hiddenTranslateX * Math.sign(event.translationX),
        {},
        () => runOnJS(setCurrentIndex)(currentIndex + 1),
      );

      const onSwipe = event.translationX > 0 ? onSwipeRight : onSwipeLeft;

      onSwipe && runOnJS(onSwipe)(currentProfile);
    },
  });

  useEffect(() => {
    translateX.value = 0;
    setNextIndex(currentIndex + 1);
  }, [currentIndex, translateX]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        rotate: rotate.value,
      },
    ],
  }));

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [-hiddenTranslateX, 0, hiddenTranslateX],
          [1, 0.8, 1],
        ),
      },
    ],
    opacity: interpolate(
      translateX.value,
      [-hiddenTranslateX, 1, hiddenTranslateX],
      [1, 0.5, 1],
    ),
  }));

  const sentimentLikeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, screenWidth / 5], [0, 1]),
  }));

  const sentimentNopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -screenWidth / 5], [0, 1]),
  }));

  return (
    <View style={styles.root}>
      {nextProfile && (
        <View style={styles.nextCardContainer}>
          <Animated.View style={[styles.animatedCard, nextCardStyle]}>
            {renderItem({ item: nextProfile })}
          </Animated.View>
        </View>
      )}
      {currentProfile ? (
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.animatedCard, cardStyle]}>
            <Animated.Image
              style={[styles.likeImage, sentimentLikeStyle]}
              source={Like}
              resizeMode="contain"
            />

            <Animated.Image
              source={Nope}
              style={[styles.nopeImage, sentimentNopeStyle]}
              resizeMode="contain"
            />
           {renderItem({ item: currentProfile })}
          </Animated.View>
        </PanGestureHandler>
      ) : (
        <View>
          <Text>Oooops, No more users!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedCard: {
    width: '80%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextCardContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeImage: {
    width: 150,
    height: 150,
    position: 'absolute',
    top: 100,
    zIndex: 1,
    left: 10,
  },
  nopeImage: {
    width: 150,
    height: 150,
    position: 'absolute',
    top: 100,
    zIndex: 1,
    right: 10,
  },
});

export default AnimatedStack;
