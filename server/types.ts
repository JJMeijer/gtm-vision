export interface FeedbackMessage {
  message: string;
  code: number;
}

export interface FeedbackMessages {
  [key: string]: FeedbackMessage;
}

export interface Container {
  resource: Resource;
  runtime: Runtime;
  permissions?: unknown;
  sandboxed_scripts?: string[];
  security_groups?: { [key: string]: string[] };
}

type Runtime = Array<string | number | Runtime>;

export interface Resource {
  version: number;
  macros: ContainerElement[];
  tags: ContainerElement[];
  predicates: Predicate[];
  rules: Rule[];
}

export type Rule = Array<['if' | 'unless' | 'add' | 'block', ...Array<number>]>;

export interface Predicate {
  function: string;
  arg0: Reference<'macro'>;
  arg1: string;
}

export type ContainerElement = {
  function: string;
} & SomeOfRawParameters;

export type SomeOfRawParameters = ObjectWithSomeOf<RawParameters>;

type ObjectWithSomeOf<T> = {
  [P in keyof T]?: T[P];
};

interface RawParameters {
  vtp_cookieDomain: StringParameter;
  vtp_functionName: StringParameter;
  vtp_trackerName: StringParameter;
  vtp_trackingId: StringParameter;
  vtp_measurementId: StringParameter;
  convert_null_to: StringParameter;
  convert_undefined_to: StringParameter;
  convert_true_to: StringParameter;
  convert_false_to: StringParameter;
  vtp_name: StringParameter;
  vtp_defaultValue: StringParameter;
  vtp_attribute: StringParameter;
  vtp_queryKey: StringParameter;
  vtp_attributeName: StringParameter;
  vtp_elementId: StringParameter;
  vtp_elementSelector: StringParameter;
  vtp_onScreenRatio: StringParameter;
  vtp_value: StringParameter;
  vtp_waitForTagsTimeout: StringParameter;
  vtp_onScreenDuration: StringParameter;
  vtp_progressThresholdsTimeInSeconds: StringParameter;
  vtp_progressThresholdsPercent: StringParameter;
  vtp_useDebugVersion: ReferenceOr<'macro', boolean>;
  vtp_useHashAutoLink: ReferenceOr<'macro', boolean>;
  vtp_decorateFormsAutoLink: ReferenceOr<'macro', boolean>;
  vtp_enableLinkId: ReferenceOr<'macro', boolean>;
  vtp_ecommerceMacroData: Reference<'macro'>;
  vtp_customUrlSource: Reference<'macro'>;
  vtp_input: Reference<'macro'>;
  vtp_gaSettings: Reference<'macro'>;
  vtp_doubleClick: boolean;
  vtp_setTrackerName: boolean;
  vtp_enableEcommerce: boolean;
  vtp_useEcommerceDataLayer: boolean;
  vtp_enableRecaptchaOption: boolean;
  vtp_enableTransportUrl: boolean;
  vtp_enableUaRlsa: boolean;
  vtp_enableUseInternalVersion: boolean;
  vtp_enableMultiQueryKeys: boolean;
  vtp_enableIgnoreEmptyQueryParam: boolean;
  vtp_setDefaultValue: boolean;
  vtp_stripWww: boolean;
  vtp_decodeCookie: boolean;
  vtp_fullMatch: boolean;
  vtp_replaceAfterMatch: boolean;
  vtp_ignoreCase: boolean;
  live_only: boolean;
  once_per_event: boolean;
  unlimited: boolean;
  once_per_load: boolean;
  vtp_sendPageView: boolean;
  vtp_overrideGaSettings: boolean;
  vtp_enableFirebaseCampaignData: boolean;
  vtp_enableUserProperties: boolean;
  vtp_waitForTags: boolean;
  vtp_checkValidation: boolean;
  vtp_useOnScreenDuration: boolean;
  vtp_useDomChangeListener: boolean;
  vtp_captureComplete: boolean;
  vtp_captureStart: boolean;
  vtp_capturePause: boolean;
  vtp_captureProgress: boolean;
  vtp_fixMissingApi: boolean;
  vtp_enableTriggerStartOption: boolean;
  vtp_isListeningTag: boolean;
  convert_case_to: 1 | 2;
  vtp_dataLayerVersion: 1 | 2;
  priority: number;
  tag_id: number;
  vtp_component: string;
  vtp_varType: string;
  vtp_selectorType: string;
  vtp_outputMethod: string;
  vtp_trackType: string;
  description: string;
  vtp_uniqueTriggerId: string;
  vtp_firingFrequency: string;
  vtp_triggerStartOption: string;
  vtp_radioButtonGroup1: string;
  vtp_firingId: string;
  vtp_javascript: Template;
  vtp_html: Template;
  metadata: Map;
  vtp_fieldsToSet: ListOfMaps;
  vtp_contentGroup: ListOfMaps;
  vtp_metric: ListOfMaps;
  vtp_dimension: ListOfMaps;
  vtp_defaultPages: ListOfMaps;
  vtp_map: ListOfMaps;
  vtp_triggerIds: listOfStrings;
  setup_tags: RawTagSequencing;
  teardown_tags: RawTagSequencing;
  [key: string]:
    | StringParameter
    | ReferenceOr<'macro', boolean>
    | Reference<'macro'>
    | boolean
    | ListOfMaps
    | listOfStrings
    | Map
    | RawTagSequencing
    | number
    | (1 | 2);
}

type Reference<T> = [T, number];

export type ReferenceOr<T, U> = Reference<T> | U;

export type Template = List<'template', Escape | ReferenceOr<'macro', string>>;

type StringParameter = Template | ReferenceOr<'macro', string>;

type Escape = ['escape', ReferenceOr<'macro', string>, ...number[]];

type List<T, U> = [T, ...U[]];

type Map = List<'map', ReferenceOr<'macro', string>>;

type ListOfMaps = List<'list', Map>;

type listOfStrings = List<'list', string>;

export type RawTagSequencing = List<'list', ['tag', number, number]>;

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
  triggerIds: listOfStrings;
  [key: string]:
    | StringParameter
    | ReferenceOr<'macro', boolean>
    | Reference<'macro'>
    | boolean
    | ListOfMaps
    | listOfStrings
    | Map
    | RawTagSequencing
    | number
    | (1 | 2);
}

export type ConvertFormat = ObjectWithSomeOf<ConvertFormatTo>;

export interface ElementCounter {
  [key: string]: number;
}

export interface ConvertFormatTo {
  case: 1 | 2;
  undefined: StringParameter;
  null: StringParameter;
  true: StringParameter;
  false: StringParameter;
}

export interface Condition {
  variable: ReferenceOr<'macro', string>;
  operator: string;
  value: string;
}

export interface ParsedElement {
  category: string;
  type: string;
  reference: string;
}

interface usedIn {
  tags?: string[];
  variables?: string[];
  triggers?: ParsedTrigger[];
}

export interface ParsedVariable extends ParsedElement {
  variableValues: SomeOfParsedParameters;
  format?: ConvertFormat;
  usedIn?: usedIn;
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

export interface ParsedTag extends ParsedElement {
  tagValues: SomeOfParsedParameters;
  tagSequencing?: ParsedTagSequencing;
  usedIn?: usedIn;
}

export interface TriggerContextTags {
  uniqueTriggerIds: {
    [key: string]: SomeOfParsedParameters;
  };
  firingIds: {
    [key: string]: number;
  };
}

export interface ParseTagsResponse {
  parsedTags: ParsedTag[];
  triggerContextTags: TriggerContextTags;
  templateContextTags: TemplateContext;
}

export interface ParsedTrigger extends ParsedElement {
  conditions: Condition[];
  tags?: ReferenceOr<'tag', string>[];
  exceptions?: ReferenceOr<'tag', string>[];
  triggerValues?: SomeOfParsedParameters;
  usedIn?: usedIn;
  triggerParent?: string;
  triggerChildren?: string[];
}

export interface ParsedContainer {
  variables: ParsedVariable[];
  tags: ParsedTag[];
  triggers: ParsedTrigger[];
}
