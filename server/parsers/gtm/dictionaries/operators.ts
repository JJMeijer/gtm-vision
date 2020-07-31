export interface OperatorDictionaryItem {
  positive: string;
  negative: string;
}

export interface OperatorDictionary {
  [key: string]: OperatorDictionaryItem;
}

export const operatorDictionary: OperatorDictionary = {
  _eq: {
    positive: 'equals',
    negative: 'does not equal',
  },
  _cn: {
    positive: 'contains',
    negative: 'does not contain',
  },
  _sw: {
    positive: 'starts with',
    negative: 'does not start with',
  },
  _ew: {
    positive: 'ends with',
    negative: 'does not end with',
  },
  _css: {
    positive: 'matches CSS selector',
    negative: 'does not match CSS selector',
  },
  _re: {
    positive: 'matches RegEx',
    negative: 'does not match RegEx',
  },
  _lt: {
    positive: 'less than',
    negative: 'is not less than',
  },
  _le: {
    positive: 'less than or equal to',
    negative: 'not less than or equal to',
  },
  _gt: {
    positive: 'greater than',
    negative: 'not greater than',
  },
  _ge: {
    positive: 'greater than or equal to',
    negative: 'not greater than or equal to',
  },
};
