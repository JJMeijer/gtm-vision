import {
  UPDATE_TAB,
  UPDATE_CONTAINER,
  UPDATE_LOADING_STATE,
  UPDATE_ELEMENT,
  NAVIGATE,
  RESET_CONTAINER,
} from './constants';

import {
  ResolvedContainer,
  FeedbackMessage,
  ResolvedTag,
  ResolvedTrigger,
  ResolvedVariable,
  SomeOfResolvedParameters,
  List,
} from '../../server/types';

export type Container = ResolvedContainer;
export type Feedback = FeedbackMessage;
export type TagType = ResolvedTag;
export type TriggerType = ResolvedTrigger;
export type VariableType = ResolvedVariable;

export type ElementList = TagType[] | TriggerType[] | VariableType[];
export type Element = TagType | TriggerType | VariableType;

export type SettingsValues = SomeOfResolvedParameters;

/**
 * Data objects
 */
export interface State {
  loadingState: boolean;
  navigation: Navigation;
  currentElements?: ElementList;
  currentElement?: Element;
  container?: Container;
  gtmId?: string;
}

export interface Navigation {
  currentTab: 0 | 1 | 2;
  indexPerTab: number[];
  currentIndex: number;
}

type EmptyList = ['list'];
type Map = List<'map', string>;
export type MapList = List<'list', Map>;
export type StringList = List<'list', string>;
type ZoneBoundary = ['zb', string, string, string, number];
export type ListOfZoneBoundary = List<'list', ZoneBoundary>;

export type ListOptions = EmptyList | StringList | MapList | ListOfZoneBoundary;

/**
 * Actions
 */
interface UpdateContainer {
  type: typeof UPDATE_CONTAINER;
  payload: {
    container: Container;
    gtmId: string;
  };
}

interface UpdateLoadingState {
  type: typeof UPDATE_LOADING_STATE;
  payload: boolean;
}

interface UpdateTab {
  type: typeof UPDATE_TAB;
  payload: 0 | 1 | 2;
}

interface UpdateElement {
  type: typeof UPDATE_ELEMENT;
  payload: number;
}

interface Navigate {
  type: typeof NAVIGATE;
  payload: {
    tabIndex: 0 | 1 | 2;
    reference: string;
  };
}

interface ResetContainer {
  type: typeof RESET_CONTAINER;
}

export type ActionTypes =
  | ResetContainer
  | Navigate
  | UpdateElement
  | UpdateTab
  | UpdateContainer
  | UpdateLoadingState;
