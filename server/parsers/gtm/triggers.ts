import {
  Predicate,
  Rule,
  ParsedTrigger,
  Condition,
  ReferenceOr,
  ElementCounter,
  TriggerContextVariables,
  TriggerContextTags,
  SomeOfParsedParameters,
  ParsedTag,
} from '../../types';
import { operatorDictionary, triggerDictionary } from './dictionaries';

const parsePredicate = (predicate: Predicate, sentiment: 'positive' | 'negative'): Condition => {
  return {
    variable: predicate.arg0,
    operator: operatorDictionary[predicate.function][sentiment],
    value: predicate.arg1,
  };
};

/**
 * Derive Trigger type through the 'Event' condition in a trigger. There
 * is an assumption that there is always 1 event condition in a trigger.
 */
const getTriggerName = (
  conditions: Condition[],
  eventVariableIndexes: number[],
  counters: ElementCounter,
): {
  category: string;
  type: string;
  reference: string;
} => {
  let type = 'Unknown';
  let eventName = '';
  conditions.forEach((condition) => {
    const { variable, value } = condition;
    if (Array.isArray(variable)) {
      if (eventVariableIndexes.indexOf(variable[1]) !== -1) {
        type = triggerDictionary[value] || 'Event';

        if (type === 'Event') {
          eventName = value;
          if (eventName.length > 22) {
            eventName = `${eventName.substr(0, 22)}...`;
          }
        }
      }
    }
  });

  const counter = counters[type] ? (counters[type] += 1) : (counters[type] = 1);
  const reference = `${type}(${counter})${eventName ? ' - ' + eventName : ''}`;

  return {
    category: 'triggers',
    type,
    reference,
  };
};

/**
 * Some triggers get their own tag to set a listener so they know when to trigger (e.g.
 * Element visibility triggers). This function copies the settings from those listener tags into
 * the corresponding trigger object.
 */
const getTriggerValues = (
  conditions: Condition[],
  triggerVariableIndex: number | undefined,
  triggerContextTags: TriggerContextTags,
): SomeOfParsedParameters | undefined => {
  if (triggerVariableIndex) {
    const triggerIdCondition = conditions.filter((condition) => {
      const { variable } = condition;
      if (Array.isArray(variable)) {
        if (variable[1] === triggerVariableIndex) {
          return true;
        }
      }
      return false;
    });

    if (triggerIdCondition.length > 0) {
      const uniqueTriggerIdMatch = triggerIdCondition[0].value.match(/\)(.+)\(/);
      if (uniqueTriggerIdMatch) {
        const uniqueTriggerId = uniqueTriggerIdMatch[1];
        return triggerContextTags.uniqueTriggerIds[uniqueTriggerId];
      }
    }
  }

  return undefined;
};

export const parseTriggers = (
  predicates: Predicate[],
  rules: Rule[],
  triggerContextVariables: TriggerContextVariables,
  triggerContextTags: TriggerContextTags,
): ParsedTrigger[] => {
  return rules.map((rule) => {
    const conditions: Condition[] = [];
    const tags: ReferenceOr<'tag', string>[] = [];
    const exceptions: ReferenceOr<'tag', string>[] = [];

    rule.forEach((partOfRule) => {
      const [type, ...indexes] = partOfRule;

      if (type === 'if') {
        indexes.forEach((index) => {
          const predicate = predicates[index];
          conditions.push(parsePredicate(predicate, 'positive'));
        });
      }

      if (type === 'unless') {
        indexes.forEach((index) => {
          const predicate = predicates[index];
          conditions.push(parsePredicate(predicate, 'negative'));
        });
      }

      if (type === 'add') {
        indexes.forEach((index) => {
          const tagReference: ['tag', number] = ['tag', index];

          if (tags.indexOf(tagReference) === -1) {
            tags.push(tagReference);
          }
        });
      }

      if (type === 'block') {
        indexes.forEach((index) => {
          const tagReference: ['tag', number] = ['tag', index];

          if (exceptions.indexOf(tagReference) === -1) {
            exceptions.push(tagReference);
          }
        });
      }
    });

    const counters: ElementCounter = {};
    const { eventVariableIndexes, triggerVariableIndex } = triggerContextVariables;
    const triggerName = getTriggerName(conditions, eventVariableIndexes, counters);

    const triggerValues = getTriggerValues(conditions, triggerVariableIndex, triggerContextTags);

    return {
      ...triggerName,
      conditions,
      ...(tags.length > 0 ? { tags } : null),
      ...(exceptions.length > 0 ? { exceptions } : null),
      ...(triggerValues ? { triggerValues } : null),
    };
  });
};

export const parseTriggerGroups = (
  parsedTags: ParsedTag[],
  parsedTriggers: ParsedTrigger[],
  triggerContextTags: TriggerContextTags,
): void => {
  parsedTriggers.forEach((parsedTrigger) => {
    if (parsedTrigger.triggerValues && parsedTrigger.triggerValues.triggerIds) {
      const [, ...triggerIds] = parsedTrigger.triggerValues.triggerIds;

      const triggersInGroup = triggerIds.map((triggerId) => {
        const triggerIdTagIndex = triggerContextTags.firingIds[triggerId];
        const triggerIdTag = parsedTags[triggerIdTagIndex];

        if (triggerIdTag.usedIn && triggerIdTag.usedIn.triggers) {
          const triggerForGroup = triggerIdTag.usedIn.triggers[0];
          if (triggerForGroup) {
            return triggerForGroup;
          }
        }

        return undefined;
      });

      triggersInGroup.forEach((triggerChild) => {
        if (triggerChild) {
          triggerChild.triggerParent = parsedTrigger.reference;
        }
      });

      parsedTrigger.triggerChildren = [];
      triggersInGroup.forEach((triggerChild) => {
        if (triggerChild !== undefined && parsedTrigger.triggerChildren) {
          parsedTrigger.triggerChildren.push(triggerChild.reference);
        }
      });
    }
  });
};
