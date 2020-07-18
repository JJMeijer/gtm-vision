const filterFromTriggers = function filterInnerTagsFromTriggers(trigger) {
  const triggerObj = trigger;
  if (triggerObj.tags) {
    triggerObj.tags = triggerObj.tags.filter(item => !item.match('inner_'));
  }
  if (triggerObj.exceptions) {
    triggerObj.exceptions = triggerObj.exceptions.filter(item => !item.match('inner_'));
  }

  return triggerObj;
};

const filterFromTagSeqeuncing = function filterInnerTagsFromTagSequencing(tag) {
  const tagObj = tag;
  const { tagSequencing } = tagObj;

  if (tagSequencing) {
    if (tagSequencing.setup && tagSequencing.setup.tag.match('inner_')) {
      delete tagSequencing.setup;
    }
    if (tagSequencing.teardown && tagSequencing.teardown.tag.match('inner_')) {
      delete tagSequencing.teardown;
    }
    if (Object.keys(tagSequencing).length === 0) {
      delete tagObj.tagSequencing;
    }
  }

  return tagObj;
};

export { filterFromTriggers, filterFromTagSeqeuncing };
