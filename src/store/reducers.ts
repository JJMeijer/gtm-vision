import { UPDATE_CONTAINER, UPDATE_LOADING_STATE, UPDATE_TAB } from './constants';
import { State, ActionTypes } from './types';

const initialState: State = {
  loadingState: false,
  navigation: {
    currentTab: 0,
    currentIndex: 0,
    indexPerTab: [0, 0, 0],
  },
};

export const reducer = (state = initialState, action: ActionTypes): State => {
  switch (action.type) {
    case UPDATE_CONTAINER:
      return {
        ...state,
        container: action.payload,
        gtmId: action.gtmId,
      };

    case UPDATE_LOADING_STATE:
      return {
        ...state,
        loadingState: action.payload,
      };

    case UPDATE_TAB:
      const newIndex = action.payload as number;
      const listElements =
        newIndex === 0
          ? state.container?.tags
          : newIndex === 1
          ? state.container?.triggers
          : state.container?.variables;

      return {
        ...state,
        navigation: {
          ...state.navigation,
          currentTab: newIndex,
          currentIndex: state.navigation.indexPerTab[newIndex],
        },
        listElements,
      };

    default:
      return state;
  }
};
