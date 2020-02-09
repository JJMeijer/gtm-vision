const removeInner = function removeInnerElementsFromTagsAndVariables(container) {
  const obj = container;
  Object.keys(obj).forEach((elementType) => {
    obj[elementType] = obj[elementType].filter(item => !item.type.match('inner_'));
  });
};

export default removeInner;
