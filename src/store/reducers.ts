import {
  UPDATE_CONTAINER,
  UPDATE_LOADING_STATE,
  UPDATE_TAB,
  UPDATE_ELEMENT,
  TAB_INDEX_TAGS,
  TAB_INDEX_TRIGGERS,
  TAB_INDEX_VARIABLES,
} from './constants';
import { State, ActionTypes, ElementList } from './types';

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
    case UPDATE_LOADING_STATE:
      return {
        ...state,
        loadingState: action.payload,
      };

    case UPDATE_CONTAINER:
      const container = action.payload;
      return {
        ...state,
        container,
        navigation: {
          currentTab: 0,
          currentIndex: 0,
          indexPerTab: [0, 0, 0],
        },
        currentElements: container.tags,
        currentElement: container.tags[0],
      };

    case UPDATE_TAB:
      const newTabIndex = action.payload;

      const newCurrentIndex = state.navigation.indexPerTab[newTabIndex];

      let newElements: ElementList = [];
      if (state.container) {
        if (newTabIndex === TAB_INDEX_TAGS) {
          newElements = state.container.tags;
        }

        if (newTabIndex === TAB_INDEX_TRIGGERS) {
          newElements = state.container.triggers;
        }

        if (newTabIndex === TAB_INDEX_VARIABLES) {
          newElements = state.container.variables;
        }
      }

      return {
        ...state,
        navigation: {
          ...state.navigation,
          currentTab: newTabIndex,
          currentIndex: state.navigation.indexPerTab[newTabIndex],
        },
        currentElements: newElements,
        currentElement: newElements[newCurrentIndex],
      };

    case UPDATE_ELEMENT:
      const newItemIndex = action.payload;

      const newIndexList = state.navigation.indexPerTab.map((originalValue, index) => {
        if (index === state.navigation.currentTab) {
          return newItemIndex;
        }

        return originalValue;
      });

      return {
        ...state,
        navigation: {
          ...state.navigation,
          currentIndex: newItemIndex,
          indexPerTab: newIndexList,
        },
        currentElement: state.currentElements && state.currentElements[newItemIndex],
      };

    default:
      return state;
  }
};
