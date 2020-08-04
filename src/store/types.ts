import {
  UPDATE_TAB,
  UPDATE_CONTAINER,
  UPDATE_LOADING_STATE,
  UPDATE_ELEMENT,
  NAVIGATE,
  RESET_CONTAINER,
} from './constants';

import {
  ParsedContainer,
  FeedbackMessage,
  ParsedTag,
  ParsedTrigger,
  ParsedVariable,
  SomeOfParsedParameters,
  List,
} from '../../server/types';

export type Container = ParsedContainer;
export type Feedback = FeedbackMessage;
export type TagT = ParsedTag;
export type TriggerT = ParsedTrigger;
export type VariableT = ParsedVariable;

export type ElementList = Tag[] | Trigger[] | Variable[];
export type Element = TagT | TriggerT | VariableT;

export type SettingsValues = SomeOfParsedParameters;

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

interface Navigate {
  type: typeof NAVIGATE;
  payload: {
    tabIndex: number;
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
