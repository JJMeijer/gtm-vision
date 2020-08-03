import { UPDATE_CONTAINER, UPDATE_LOADING_STATE, UPDATE_TAB } from './constants';
import { Container, ActionTypes } from './types';

export const updateContainer = (container: Container, gtmId: string): ActionTypes => {
  return {
    type: UPDATE_CONTAINER,
    payload: container,
    gtmId,
  };
};

export const updateLoadingState = (state: boolean): ActionTypes => {
  return {
    type: UPDATE_LOADING_STATE,
    payload: state,
  };
};

export const updateTab = (newTabIndex: number): ActionTypes => {
  return {
    type: UPDATE_TAB,
    payload: newTabIndex,
  };
};
