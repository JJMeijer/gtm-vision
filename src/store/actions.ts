import {
  UPDATE_CONTAINER,
  UPDATE_ELEMENT,
  UPDATE_LOADING_STATE,
  UPDATE_TAB,
  NAVIGATE,
} from './constants';
import { Container, ActionTypes } from './types';

export const updateContainer = (container: Container, gtmId: string): ActionTypes => {
  return {
    type: UPDATE_CONTAINER,
    payload: {
      container,
      gtmId,
    },
  };
};

export const updateLoadingState = (state: boolean): ActionTypes => {
  return {
    type: UPDATE_LOADING_STATE,
    payload: state,
  };
};

export const updateTab = (newTabIndex: 0 | 1 | 2): ActionTypes => {
  return {
    type: UPDATE_TAB,
    payload: newTabIndex,
  };
};

export const updateElement = (newItemIndex: number): ActionTypes => {
  return {
    type: UPDATE_ELEMENT,
    payload: newItemIndex,
  };
};

export const navigate = (newTabIndex: 0 | 1 | 2, newElementReference: string): ActionTypes => {
  return {
    type: NAVIGATE,
    payload: {
      tabIndex: newTabIndex,
      reference: newElementReference,
    },
  };
};
