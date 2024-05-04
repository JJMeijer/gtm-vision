import type { MACROS, OPERATORS, TAGS, TRIGGERS } from "./parser/dictionaries";

export type Reference<T> = [T, number];
type List<T, U> = [T, ...U[]];

export type Escape = ["escape", Reference<"macro">, number, number];
export type ResolvedEscape = ["escape", string, number, number];

export type Boundary = ["zb", keyof typeof OPERATORS, Reference<"macro">, string, boolean, boolean];
export type ListOfBoundaries = List<"list", Boundary>;
export type ParsedBoundary = ["zb", string, Reference<"macro">, string];
export type ListofParsedBoundaries = List<"list", ParsedBoundary>;
export type ResolvedBoundary = ["zb", keyof typeof OPERATORS, string, string];
export type ListOfResolvedBoundaries = List<"list", ResolvedBoundary>;

export type Template = List<"template", string | Escape>;
export type ResolvedTemplate = List<"template", string>;

type Map = List<"map", Reference<"macro"> | string>;
export type ResolvedMap = List<"map", string>;

type ListOfMaps = List<"list", Map>;
export type ListOfResolvedMaps = List<"list", ResolvedMap>;
type ListOfStrings = List<"list", string>;
type StringProperty = Template | Reference<"macro"> | string;
type TagSequencingList = ["list", ["tag", number, number]];

type Property =
    | StringProperty
    | number
    | boolean
    | Map
    | ListOfMaps
    | ListOfStrings
    | TagSequencingList
    | ListOfBoundaries;

export type ParsedProperty =
    | StringProperty
    | number
    | boolean
    | Map
    | ListOfMaps
    | ListOfStrings
    | ListofParsedBoundaries;

export type ResolvedProperty =
    | string
    | number
    | boolean
    | ResolvedMap
    | ListOfResolvedMaps
    | ListOfStrings
    | ListOfResolvedBoundaries;

export interface ItemProperties {
    consent?: ListOfStrings;
    convert_case_to?: 1 | 2;
    convert_false_to?: StringProperty;
    convert_true_to?: StringProperty;
    convert_undefined_to?: StringProperty;
    convert_null_to?: StringProperty;
    metadata?: List<"map", string>;
    once_per_event?: boolean;
    once_per_load?: boolean;
    unlimited?: boolean;
    live_only?: boolean;
    priority?: number;
    vtp_trackType?: string;
    setup_tags?: TagSequencingList;
    teardown_tags?: TagSequencingList;
    vtp_boundaries?: ListOfBoundaries;
    [key: string]: Property | undefined;
}

export interface ParsedProperties {
    varType?: string;
    metadata?: Map;
    firingOption?: string;
    tagPriority?: number;
    onlyFireInPublishedContainers?: boolean;
    trackType?: string;
    html?: StringProperty;
    uniqueTriggerId?: string;
    firingId?: string;
    triggerIds?: ListOfStrings;
    boundaries?: ListofParsedBoundaries;
    [key: string]: ParsedProperty | undefined;
}

export interface ResolvedProperties {
    [key: string]: ResolvedProperty;
}

/**
 * Unparsed Container Types
 */
export interface Macro extends ItemProperties {
    function: keyof typeof MACROS;
}

export interface Tag extends ItemProperties {
    function: keyof typeof TAGS;
}

export interface Predicate {
    function: keyof typeof OPERATORS;
    arg0: Reference<"macro">;
    arg1: string;
}

export type Rule = Array<["if" | "unless" | "add" | "block", ...Array<number>]>;

interface Resource {
    macros: Macro[];
    predicates: Predicate[];
    rules: Rule[];
    tags: Tag[];
}

export interface Permissions {
    [key: string]: Record<string, unknown>;
}

export interface PermissionsList {
    [key: string]: Permissions;
}

export type RuntimeInstructionContent = string | number | boolean | RuntimeInstruction;
export type RuntimeInstruction = [number | string, ...RuntimeInstructionContent[]];

export type Runtime = [50, string, ...RuntimeInstruction[]];

export interface RuntimeOperations {
    [key: number | string]: (content: RuntimeInstructionContent[]) => string;
}

export interface Container {
    resource: Resource;
    runtime: Runtime[];
    permissions: PermissionsList;
    sandboxed_scripts: string[];
}

/**
 * General Parsing Types
 */
export interface Counter {
    [key: string]: number;
}

export interface ItemName {
    name: string;
    type: string;
}

export interface References {
    variables: string[];
    tags: string[];
    triggers: string[];
}

/**
 * Macro parsing types
 */
export interface TriggerContextMacros {
    eventMacros: number[];
    triggerMacro?: number;
}

export interface MacroFormat {
    case?: 1 | 2;
    undefined?: StringProperty;
    null?: StringProperty;
    true?: StringProperty;
    false?: StringProperty;
}

export interface ParsedMacro extends ItemName {
    index: number;
    category: "variables";
    properties: ParsedProperties;
    format?: MacroFormat;
    references: References;
    size: string;
}

export interface ResolvedMacro extends ItemName {
    index: number;
    category: "variables";
    properties: ResolvedProperties;
    format?: MacroFormat;
    references: References;
    size: string;
}

/**
 * Tag Parsing Types
 */
export interface TagSequencing {
    setup?: {
        tag: Reference<"tag"> | string;
        optionText: string;
    };
    teardown?: {
        tag: Reference<"tag"> | string;
        optionText: string;
    };
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

export interface TriggerContextTags {
    customTriggerTags: {
        [key: string]: ParsedTag;
    };
    triggerGroupTags: {
        [key: string]: ParsedTag;
    };
}

export interface ParsedTag extends ItemName {
    index: number;
    category: "tags";
    properties: ParsedProperties;
    consent: string[];
    tagSequencing?: TagSequencing;
    references: References;
    size: string;
}

export interface ResolvedTag extends ItemName {
    index: number;
    category: "tags";
    properties: ResolvedProperties;
    consent: string[];
    tagSequencing?: ResolvedTagSequencing;
    references: References;
    size: string;
}

/**
 * Trigger parsing types
 */
export interface Condition {
    variable: Reference<"macro">;
    operator: string;
    value: keyof typeof TRIGGERS | string;
}

export interface ResolvedCondition {
    variable: string;
    operator: string;
    value: keyof typeof TRIGGERS | string;
}

export interface ParsedTrigger extends ItemName {
    index: number;
    category: "triggers";
    conditions: Condition[];
    properties?: ParsedProperties;
    tags?: Reference<"tag">[];
    exceptions?: Reference<"tag">[];
    triggerParents?: string[];
    triggerChildren?: string[];
    size: string;
}

export interface ResolvedTrigger extends ItemName {
    index: number;
    category: "triggers";
    conditions: ResolvedCondition[];
    properties?: ResolvedProperties;
    tags?: string[];
    exceptions?: string[];
    triggerParents?: string[];
    triggerChildren?: string[];
    size: string;
}

export interface ParsedRuntime {
    code: string;
    permissions: Permissions;
}

export interface ParsedRuntimes {
    [key: string]: ParsedRuntime;
}

export interface ParsedContainer {
    variables: ParsedMacro[];
    tags: ParsedTag[];
    triggers: ParsedTrigger[];
}

export interface ResolvedContainer {
    variables: ResolvedMacro[];
    tags: ResolvedTag[];
    triggers: ResolvedTrigger[];
}

export interface GenericObject {
    [key: string]: unknown;
}

export interface MinimalComponent {
    name: string;
    index: number;
}
