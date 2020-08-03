import { UPDATE_TAB, UPDATE_CONTAINER, UPDATE_LOADING_STATE, UPDATE_ELEMENT } from './constants';

import {
  ParsedContainer,
  FeedbackMessage,
  ParsedTag,
  ParsedTrigger,
  ParsedVariable,
} from '../../server/types';

export type Container = ParsedContainer;
export type Feedback = FeedbackMessage;
export type ElementList = ParsedTag[] | ParsedTrigger[] | ParsedVariable[];
export type Element = ParsedTag | ParsedTrigger | ParsedVariable;

/**
 * Data objects
 */
export interface State {
  loadingState: boolean;
  navigation: Navigation;
  currentElements?: ElementList;
  currentElement?: Element;
  container?: Container;
}

export interface Navigation {
  currentTab: number;
  indexPerTab: number[];
  currentIndex: number;
}

/**
 * Actions
 */
interface UpdateContainer {
  type: typeof UPDATE_CONTAINER;
  payload: Container;
}

interface UpdateLoadingState {
  type: typeof UPDATE_LOADING_STATE;
  payload: boolean;
}

interface UpdateTab {
  type: typeof UPDATE_TAB;
  payload: number;
}

interface UpdateElement {
  type: typeof UPDATE_ELEMENT;
  payload: number;
}

export type ActionTypes = UpdateElement | UpdateTab | UpdateContainer | UpdateLoadingState;
