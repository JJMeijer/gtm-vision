import {
  ObjectWithSomeOf,
  StringParameter,
  Reference,
  ReferenceOr,
  Template,
  Map,
  List,
  ListOfMaps,
  ListOfStrings,
} from './shared';

export interface RawContainer {
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

export type ContainerElement = {
  function: string;
} & SomeOfRawParameters;

export type Rule = Array<['if' | 'unless' | 'add' | 'block', ...Array<number>]>;

export interface Predicate {
  function: string;
  arg0: Reference<'macro'>;
  arg1: string;
}

export type RawTagSequencing = List<'list', ['tag', number, number]>;

export type SomeOfRawParameters = ObjectWithSomeOf<RawParameters>;

export type VtpParameter =
  | StringParameter
  | ReferenceOr<'macro', boolean>
  | Reference<'macro'>
  | boolean
  | (1 | 2)
  | string
  | Template
  | ListOfStrings
  | ListOfMaps;

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
  vtp_triggerIds: ListOfStrings;
  setup_tags: RawTagSequencing;
  teardown_tags: RawTagSequencing;
  [key: string]:
    | StringParameter
    | ReferenceOr<'macro', boolean>
    | Reference<'macro'>
    | boolean
    | ListOfMaps
    | ListOfStrings
    | Map
    | RawTagSequencing
    | number
    | (1 | 2);
}
