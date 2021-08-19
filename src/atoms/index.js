import {atom, selector} from 'recoil';
import {DataStore} from 'aws-amplify';

import {Match} from '../models/index';

export const isUsersLoadingState = atom({
  key: 'isUsersLoadingState',
  default: true,
});

export const meState = atom({
  key: 'meState', // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export const userDBState = atom({
  key: 'userDBState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const currentCardState = atom({
  key: 'currentCardState', // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export const allMatchesState = atom({
  key: 'allMatchesState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const matchCountState = selector({
  key: 'matchCountState', // unique ID (with respect to other atoms/selectors)
  get: ({get}) => {
    const cnt = get(allMatchesState); //gets the atom defined above

    return cnt.length;
  },
});

// export const allMatchesState = selector({
//   key: 'allMatchesState',
//   get: async () => {
//     try {
//       const myMatches = await DataStore.query(Match, match =>
//         match.User1ID('eq', me.id).isMatch('eq', true),
//       );

//       return myMatches;
//     } catch (e) {
//       console.log('Error: ', e);
//       return [];
//     }
//   },
// });
