import operatorDictionary from './dictionaries/operators';
import triggerDictionary from './dictionaries/triggers';

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

    ruleObj.occurrences = 0;
    ruleObj.category = 'trigger';
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
          resultArray.push(['tag', tag]);
        });
        ruleObj.occurrences += resultArray.length;
        ruleObj.exceptions = resultArray;
      }

      if (rulePartType === 'add') {
        const resultArray = [];

        const tagArray = rulePart.slice(1);
        tagArray.forEach((tag) => {
          resultArray.push(['tag', tag]);
        });
        ruleObj.occurrences += resultArray.length;
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
  const triggerType = trigger.conditions.filter(cond => cond.variable.match('Event'))[0].value;

  if (triggerList[triggerType]) {
    trigger.reference = `${trigger.reference} - ${triggerList[triggerType]}`;
    trigger.type = triggerList[triggerType];
  } else {
    trigger.reference = `${trigger.reference} - Event: ${triggerType}`;
    trigger.type = 'event';
  }

  return trigger;
};

export { parseTriggers, parseTriggerNames };
