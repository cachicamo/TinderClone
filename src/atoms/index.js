import {atom, selector} from 'recoil';

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

export const matchesState = atom({
  key: 'matchesState', // unique ID (with respect to other atoms/selectors)
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

export const usersToView = selector({
  key: 'usersToView',
  get: ({get}) => {
    const me = get(meState);
    const matches = get(matchesState);
    const users = get(userDBState);

    const matchesIDs = matches.map(match =>
      me.id !== match.User1ID ? match.User1ID : match.User2ID,
    );

    const result = users.filter(db =>
      !matchesIDs.includes(db.id) && db.id !== me.id
    );

    return result;
  },
});
