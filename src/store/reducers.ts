import {
  UPDATE_CONTAINER,
  UPDATE_LOADING_STATE,
  UPDATE_TAB,
  UPDATE_ELEMENT,
  RESET_CONTAINER,
  NAVIGATE,
  TAB_INDEX_TAGS,
  TAB_INDEX_TRIGGERS,
  TAB_INDEX_VARIABLES,
} from './constants';
import { State, ActionTypes, ElementList, Container } from './types';

const initialState: State = {
  loadingState: false,
  navigation: {
    currentTab: 0,
    currentIndex: 0,
    indexPerTab: [0, 0, 0],
  },
};

const getElementsForTab = (state: State, tabIndex: 0 | 1 | 2): ElementList => {
  const container = state.container as Container;

  if (tabIndex === TAB_INDEX_TAGS) {
    return container.tags;
  }

  if (tabIndex === TAB_INDEX_TRIGGERS) {
    return container.triggers;
  }

  if (tabIndex === TAB_INDEX_VARIABLES) {
    return container.variables;
  }

  /**
   * Default value.
   * TODO: handle more gracefully, maybe log an error or something.
   */
  return container.tags;
};

const updateIndexList = (state: State, tabIndex: 0 | 1 | 2, newItemIndex: number): number[] => {
  return state.navigation.indexPerTab.map((previousElementIndex: number, index: number) => {
    if (index === tabIndex) {
      return newItemIndex;
    }
    return previousElementIndex;
  });
};

const findIndexForReference = (state: State, tabIndex: 0 | 1 | 2, reference: string): number => {
  const { tags, triggers, variables } = state.container as Container;

  if (tabIndex === TAB_INDEX_TAGS) {
    return tags.findIndex((tag) => tag.reference === reference);
  }

  if (tabIndex === TAB_INDEX_TRIGGERS) {
    return triggers.findIndex((trigger) => trigger.reference === reference);
  }

  if (tabIndex === TAB_INDEX_VARIABLES) {
    return variables.findIndex((variable) => variable.reference === reference);
  }

  /**
   * Default value.
   * TODO: handle more gracefully, maybe log an error or something.
   */
  return 0;
};

export const reducer = (state = initialState, action: ActionTypes): State => {
  switch (action.type) {
    case UPDATE_LOADING_STATE: {
      return {
        ...state,
        loadingState: action.payload,
      };
    }

    case RESET_CONTAINER: {
      return {
        ...state,
        container: undefined,
        gtmId: undefined,
        navigation: {
          currentTab: 0,
          currentIndex: 0,
          indexPerTab: [0, 0, 0],
        },
        currentElement: undefined,
        currentElements: undefined,
      };
    }

    case UPDATE_CONTAINER: {
      const { container, gtmId } = action.payload;
      return {
        ...state,
        container,
        gtmId,
        navigation: {
          currentTab: 0,
          currentIndex: 0,
          indexPerTab: [0, 0, 0],
        },
        currentElements: container.tags,
        currentElement: container.tags[0],
      };
    }

    case UPDATE_TAB: {
      const newTabIndex = action.payload;
      const newCurrentIndex = state.navigation.indexPerTab[newTabIndex];
      const newElements = getElementsForTab(state, newTabIndex);

      return {
        ...state,
        navigation: {
          ...state.navigation,
          currentTab: newTabIndex,
          currentIndex: newCurrentIndex,
        },
        currentElements: newElements,
        currentElement: newElements[newCurrentIndex],
      };
    }

    case UPDATE_ELEMENT: {
      const newItemIndex = action.payload;

      const newIndexList = updateIndexList(state, state.navigation.currentTab, newItemIndex);

      return {
        ...state,
        navigation: {
          ...state.navigation,
          currentIndex: newItemIndex,
          indexPerTab: newIndexList,
        },
        currentElement: state.currentElements && state.currentElements[newItemIndex],
      };
    }

    case NAVIGATE: {
      const { tabIndex, reference } = action.payload;
      const newItemIndex = findIndexForReference(state, tabIndex, reference);
      const newIndexList = updateIndexList(state, tabIndex, newItemIndex);
      const newElements = getElementsForTab(state, tabIndex);

      return {
        ...state,
        navigation: {
          currentIndex: newItemIndex,
          currentTab: tabIndex,
          indexPerTab: newIndexList,
        },
        currentElements: newElements,
        currentElement: newElements[newItemIndex],
      };
    }

    default:
      return state;
  }
};
