const searchContainer = function searchContainer(container, term) {
  const containerElements = [
    ...container.tags,
    ...container.triggers,
    ...container.variables,
  ];

  return containerElements.filter((element) => {
    if (element.reference.match(term)) {
      return true;
    }

    if (element.type.match(term)) {
      return true;
    }

    return false;
  });
};

export default searchContainer;
