import {
  ReferenceOr,
  ObjectWithSomeOf,
  StringParameter,
  Reference,
  Map,
  Template,
  ListOfMaps,
  ListOfStrings,
  NamedElement,
} from './shared';
import { usedIn } from './ResolvedContainer';

export type SomeOfParsedParameters = ObjectWithSomeOf<ParsedParameters>;

interface ParsedParameters {
  cookieDomain: StringParameter;
  functionName: StringParameter;
  trackerName: StringParameter;
  trackingId: StringParameter;
  measurementId: StringParameter;
  convert_null_to: StringParameter;
  convert_undefined_to: StringParameter;
  convert_true_to: StringParameter;
  convert_false_to: StringParameter;
  name: StringParameter;
  defaultValue: StringParameter;
  attribute: StringParameter;
  queryKey: StringParameter;
  attributeName: StringParameter;
  elementId: StringParameter;
  elementSelector: StringParameter;
  onScreenRatio: StringParameter;
  value: StringParameter;
  waitForTagsTimeout: StringParameter;
  onScreenDuration: StringParameter;
  progressThresholdsTimeInSeconds: StringParameter;
  progressThresholdsPercent: StringParameter;
  useDebugVersion: ReferenceOr<'macro', boolean>;
  useHashAutoLink: ReferenceOr<'macro', boolean>;
  decorateFormsAutoLink: ReferenceOr<'macro', boolean>;
  enableLinkId: ReferenceOr<'macro', boolean>;
  ecommerceMacroData: Reference<'macro'>;
  customUrlSource: Reference<'macro'>;
  input: Reference<'macro'>;
  gaSettings: Reference<'macro'>;
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
  javascript: Template | string;
  html: Template | string;
  metadata: Map;
  fieldsToSet: ListOfMaps;
  contentGroup: ListOfMaps;
  metric: ListOfMaps;
  dimension: ListOfMaps;
  defaultPages: ListOfMaps;
  map: ListOfMaps;
  triggerIds: ListOfStrings;
  [key: string]:
    | StringParameter
    | ReferenceOr<'macro', boolean>
    | Reference<'macro'>
    | boolean
    | ListOfMaps
    | ListOfStrings
    | Map
    | number
    | (1 | 2);
}

export interface ElementCounter {
  [key: string]: number;
}

export interface ParsedContainer {
  variables: ParsedVariable[];
  tags: ParsedTag[];
  triggers: ParsedTrigger[];
}

export interface ParsedVariable extends NamedElement {
  category: 'variables';
  variableValues: SomeOfParsedParameters;
  format?: ConvertFormat;
  usedIn?: usedIn;
}

export type ConvertFormat = ObjectWithSomeOf<ConvertFormatTo>;

export interface ConvertFormatTo {
  case: 1 | 2;
  undefined: StringParameter;
  null: StringParameter;
  true: StringParameter;
  false: StringParameter;
}

export interface TriggerContextVariables {
  eventVariableIndexes: number[];
  triggerVariableIndex: number | undefined;
}

export interface TemplateContext {
  [index: string]: string[];
}

export interface ParseMacrosResponse {
  parsedVariables: ParsedVariable[];
  triggerContextVariables: TriggerContextVariables;
  templateContextVariables: TemplateContext;
}

export interface ParseTagsResponse {
  parsedTags: ParsedTag[];
  triggerContextTags: TriggerContextTags;
  templateContextTags: TemplateContext;
}

export interface ParsedTag extends NamedElement {
  category: 'tags';
  tagValues: SomeOfParsedParameters;
  tagSequencing?: ParsedTagSequencing;
  usedIn?: usedIn;
}

export interface ParsedTagSequencing {
  setup?: {
    tag: ReferenceOr<'tag', string>;
    optionText: string;
  };
  teardown?: {
    tag: ReferenceOr<'tag', string>;
    optionText: string;
  };
}

export interface TriggerContextTags {
  uniqueTriggerIds: {
    [key: string]: SomeOfParsedParameters;
  };
  firingIds: {
    [key: string]: number;
  };
}

export interface ParsedTrigger extends NamedElement {
  category: 'triggers';
  conditions: Condition[];
  tags?: ReferenceOr<'tag', string>[];
  exceptions?: ReferenceOr<'tag', string>[];
  triggerValues?: SomeOfParsedParameters;
  triggerParent?: string;
  triggerChildren?: string[];
  usedIn?: usedIn;
}

export interface Condition {
  variable: ReferenceOr<'macro', string>;
  operator: string;
  value: string;
}
