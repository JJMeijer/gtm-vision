import { UPDATE_TAB, UPDATE_CONTAINER, UPDATE_LOADING_STATE } from './constants';

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

/**
 * Data objects
 */
export interface State {
  loadingState: boolean;
  navigation: Navigation;
  currentElements: ElementList;
  gtmId?: string;
  container?: Container;
}

export interface Navigation {
  currentTab: number;
  indexPerTab: [number, number, number];
  currentIndex: number;
}

/**
 * Actions
 */
interface UpdateContainer {
  type: typeof UPDATE_CONTAINER;
  payload: Container;
  gtmId: string;
}

interface UpdateLoadingState {
  type: typeof UPDATE_LOADING_STATE;
  payload: boolean;
}

interface UpdateTab {
  type: typeof UPDATE_TAB;
  payload: number;
}

export type ActionTypes = UpdateTab | UpdateContainer | UpdateLoadingState;
