import { operatorDictionary, triggerDictionary } from './dictionaries';

const operatorList = operatorDictionary();

const parsePredicate = (predicate, type) => ({
  variable: predicate.arg0,
  operator: operatorList[predicate.function][type],
  value: predicate.arg1,
});

const parseTriggers = function parsePredicatesAndRulesToTriggers(predicates, rules) {
  const parsedArray = [];
  rules.forEach((rule, index) => {
    const ruleObj = {};

    ruleObj.category = 'triggers';
    ruleObj.reference = `Trigger(${index})`;
    rule.forEach((rulePart) => {
      const rulePartType = rulePart[0];

      if (rulePartType.match(/^if$|^unless$/)) {
        ruleObj.conditions = ruleObj.conditions || [];

        const conditionType = rulePartType === 'if' ? 'positive' : 'negative';
        const conditionArray = rulePart.slice(1);

        conditionArray.forEach((conditionIndex) => {
          ruleObj.conditions.push(parsePredicate(predicates[conditionIndex], conditionType));
        });
      }

      if (rulePartType === 'block') {
        const resultArray = [];

        const exceptionArray = rulePart.slice(1);
        exceptionArray.forEach((tag) => {
          if (resultArray.filter(x => x[1] === tag).length === 0) {
            resultArray.push(['tag', tag]);
          }
        });
        ruleObj.exceptions = resultArray;
      }

      if (rulePartType === 'add') {
        const resultArray = [];

        const tagArray = rulePart.slice(1);
        tagArray.forEach((tag) => {
          if (resultArray.filter(x => x[1] === tag).length === 0) {
            resultArray.push(['tag', tag]);
          }
        });
        ruleObj.tags = resultArray;
      }
    });

    parsedArray.push(ruleObj);
  });
  return parsedArray;
};

const parseTriggerNames = function parseTriggerNamesBasedOnEventValue(_trigger) {
  const triggerList = triggerDictionary();
  const trigger = _trigger;
  const stockEventInTrigger = trigger.conditions.filter(cond => cond.variable.match(/Event\(1\)/)).length > 0;

  const triggerType = stockEventInTrigger
    ? trigger.conditions.filter(cond => cond.variable.match(/Event\(1\)/))[0].value
    : trigger.conditions.filter(cond => cond.variable.match('Event'))[0].value;

  if (triggerList[triggerType]) {
    trigger.reference = `${trigger.reference} - ${triggerList[triggerType]}`;
    trigger.type = triggerList[triggerType];
  } else {
    const nameCutoffLength = 22;
    const concatName = triggerType.length > nameCutoffLength;
    trigger.reference = `${trigger.reference} - Event: ${triggerType.substr(0, nameCutoffLength)}${concatName ? '...' : ''}`;
    trigger.type = 'event';
  }

  return trigger;
};

const parseSpecialTriggers = function parseTriggersWithSpecialFunctionalities(_container) {
  const container = _container;

  container.triggers = container.triggers.map((_trigger) => {
    const trigger = _trigger;

    /**
     * Handle Element Visibility, youtube video, scroll depth & timer triggers by
     * getting the 'settings' info from the related tags. The related tag can be found
     * through the ID that is in the 'gtm.triggers' condition.
     */
    const specialTriggerTypes = ['Element Visibility', 'Youtube Video', 'Scroll Depth', 'Timer'];
    if (specialTriggerTypes.indexOf(trigger.type) !== -1) {
      const uniqueTriggerCondition = trigger.conditions.filter(condition => condition.variable.match('gtm.triggers'))[0];

      if (uniqueTriggerCondition) {
        const uniqueTriggerId = uniqueTriggerCondition.value.match(/\)(.+)\(/)[1];

        // Find Corresponding tag for the ID
        const correspondingTag = container.tags.filter((tag) => {
          if (tag.tagValues) {
            if (tag.tagValues.uniqueTriggerId === uniqueTriggerId) {
              return true;
            }
          }
          return false;
        })[0];

        /**
         * Transfer info from tag.tagValues to trigger.triggerValues
         * Except for the uniqueTriggerId
         */
        trigger.triggerValues = {};
        Object.keys(correspondingTag.tagValues).forEach((key) => {
          if (key !== 'uniqueTriggerId') {
            trigger.triggerValues[key] = correspondingTag.tagValues[key];
          }
        });
      }
    }

    /**
     * Handle Trigger Groups. Trigger groups info can be found in a related tag.
     * this related tag can be found through the ID that is in the gtm.triggers condition.
     * Within the related tag the other tags are referenced. Each of these tags
     * represent a trigger in the group. within those tag the info in the 'usedIn'
     * property is used to return the data about the trigger.
     */
    if (trigger.type === 'Trigger Group') {
      const uniqueTriggerCondition = trigger.conditions.filter(condition => condition.variable.match('gtm.triggers'))[0];
      const uniqueTriggerId = uniqueTriggerCondition.value.match(/\)(.+)\(/)[1];

      const triggerGroupTag = container.tags.filter((tag) => {
        if (tag.tagValues) {
          if (tag.tagValues.uniqueTriggerId === uniqueTriggerId) {
            return true;
          }
        }
        return false;
      })[0];

      const { tagValues: { triggerIds } } = triggerGroupTag;

      const triggersInGroup = triggerIds.slice(1).map((triggerId) => {
        const triggerTag = container.tags.filter((tag) => {
          if (tag.tagValues) {
            if (tag.tagValues.firingId === triggerId) {
              return true;
            }
          }
          return false;
        })[0];

        return triggerTag.usedIn.triggers[0];
      });

      triggersInGroup.map((_triggerChild) => {
        const triggerChild = _triggerChild;
        triggerChild.triggerParent = trigger.reference;

        return triggerChild;
      });

      trigger.triggerChildren = triggersInGroup;
    }

    return trigger;
  });

  return container;
};

export { parseTriggers, parseTriggerNames, parseSpecialTriggers };
