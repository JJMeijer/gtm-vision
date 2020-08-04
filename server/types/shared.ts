export type ObjectWithSomeOf<T> = {
  [P in keyof T]?: T[P];
};

export type Reference<T> = [T, number];

export type ReferenceOr<T, U> = Reference<T> | U;

export type Escape = ['escape', ReferenceOr<'macro', string>, ...number[]];

export type Template = List<'template', Escape | ReferenceOr<'macro', string>>;

export type StringParameter = Template | ReferenceOr<'macro', string>;

export type List<T, U> = [T, ...U[]];

export type Map = List<'map', ReferenceOr<'macro', string>>;

export type ListOfMaps = List<'list', Map>;

export type ListOfStrings = List<'list', string>;

export interface NamedElement {
  type: string;
  reference: string;
}
