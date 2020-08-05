import { ObjectWithSomeOf, List, ListOfStrings, NamedElement } from './shared';

export type ResolvedMap = List<'map', string>;
export type ListOfResolvedMaps = List<'list', ResolvedMap>;
export type ResolvedTemplate = List<'template', ResolvedEscape | string>;
export type ResolvedEscape = ['escape', string, ...number[]];

export type SomeOfResolvedParameters = ObjectWithSomeOf<ResolvedParameters>;

interface ResolvedParameters {
  cookieDomain: string;
  functionName: string;
  trackerName: string;
  trackingId: string;
  measurementId: string;
  convert_null_to: string;
  convert_undefined_to: string;
  convert_true_to: string;
  convert_false_to: string;
  name: string;
  defaultValue: string;
  attribute: string;
  queryKey: string;
  attributeName: string;
  elementId: string;
  elementSelector: string;
  onScreenRatio: string;
  value: string;
  waitForTagsTimeout: string;
  onScreenDuration: string;
  progressThresholdsTimeInSeconds: string;
  progressThresholdsPercent: string;
  useDebugVersion: string | boolean;
  useHashAutoLink: string | boolean;
  decorateFormsAutoLink: string | boolean;
  enableLinkId: string | boolean;
  ecommerceMacroData: string;
  customUrlSource: string;
  input: string;
  gaSettings: string;
  doubleClick: boolean;
  setTrackerName: boolean;
  enableEcommerce: boolean;
  useEcommerceDataLayer: boolean;
  enableRecaptchaOption: boolean;
  enableTransportUrl: boolean;
  enableUaRlsa: boolean;
  enableUseInternalVersion: boolean;
  enableMultiQueryKeys: boolean;
  enableIgnoreEmptyQueryParam: boolean;
  setDefaultValue: boolean;
  stripWww: boolean;
  decodeCookie: boolean;
  fullMatch: boolean;
  replaceAfterMatch: boolean;
  ignoreCase: boolean;
  onlyFireInPublishedContainers: boolean;
  once_per_event: boolean;
  unlimited: boolean;
  once_per_load: boolean;
  sendPageView: boolean;
  overrideGaSettings: boolean;
  enableFirebaseCampaignData: boolean;
  enableUserProperties: boolean;
  waitForTags: boolean;
  checkValidation: boolean;
  useOnScreenDuration: boolean;
  useDomChangeListener: boolean;
  captureComplete: boolean;
  captureStart: boolean;
  capturePause: boolean;
  captureProgress: boolean;
  fixMissingApi: boolean;
  enableTriggerStartOption: boolean;
  isListeningTag: boolean;
  convert_case_to: 1 | 2;
  dataLayerVersion: 1 | 2;
  tagPriority: number;
  tag_id: number;
  firingOption: string;
  component: string;
  varType: string;
  selectorType: string;
  outputMethod: string;
  trackType: string;
  description: string;
  firingFrequency: string;
  uniqueTriggerId: string;
  triggerStartOption: string;
  radioButtonGroup1: string;
  firingId: string;
  javascript: string;
  html: string;
  metadata: ResolvedMap;
  fieldsToSet: ListOfResolvedMaps;
  contentGroup: ListOfResolvedMaps;
  metric: ListOfResolvedMaps;
  dimension: ListOfResolvedMaps;
  defaultPages: ListOfResolvedMaps;
  map: ListOfResolvedMaps;
  triggerIds: ListOfStrings;
  [key: string]:
    | string
    | boolean
    | ListOfResolvedMaps
    | ListOfStrings
    | ResolvedTemplate
    | ResolvedMap
    | number
    | (1 | 2);
}

export type ResolvedConvertFormat = ObjectWithSomeOf<ResolvedConvertFormatTo>;

export interface ResolvedConvertFormatTo {
  case: 1 | 2;
  undefined: string;
  null: string;
  true: string;
  false: string;
}

export interface usedIn {
  tags?: string[];
  variables?: string[];
  triggers?: ResolvedTrigger[];
}

export interface ResolvedTagSequencing {
  setup?: {
    tag: string;
    optionText: string;
  };
  teardown?: {
    tag: string;
    optionText: string;
  };
}

export interface ResolvedCondition {
  variable: string;
  operator: string;
  value: string;
}

export interface ResolvedContainer {
  variables: ResolvedVariable[];
  tags: ResolvedTag[];
  triggers: ResolvedTrigger[];
}

export interface ResolvedVariable extends NamedElement {
  category: 'variables';
  variableValues: SomeOfResolvedParameters;
  format?: ResolvedConvertFormat;
  usedIn?: usedIn;
}

export interface ResolvedTag extends NamedElement {
  category: 'tags';
  tagValues: SomeOfResolvedParameters;
  tagSequencing?: ResolvedTagSequencing;
  usedIn?: usedIn;
}

export interface ResolvedTrigger extends NamedElement {
  category: 'triggers';
  conditions: ResolvedCondition[];
  tags?: string[];
  exceptions?: string[];
  triggerValues?: SomeOfResolvedParameters;
  usedIn?: usedIn;
  triggerParent?: string;
  triggerChildren?: string[];
}
