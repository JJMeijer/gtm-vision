import { tagExpander, triggerExpander, variableExpander } from './expanders';

const getTableColumns = (type) => {
  const columnDefinitions = {
    tags: [
      {
        type: 'expand',
        expandPannel: tagExpander,
      },
      {
        label: 'Name',
        prop: 'reference',
        sortable: true,
      },
      {
        label: 'Type',
        prop: 'type',
        sortable: true,
      },
    ],
    triggers: [
      {
        type: 'expand',
        expandPannel: triggerExpander,
      },
      {
        label: 'Name',
        prop: 'reference',
        sortable: true,
      },
      {
        label: 'Type',
        prop: 'type',
        sortable: true,
      },
      {
        label: 'Occurrences',
        prop: 'occurrences',
        sortable: true,
      },
    ],
    variables: [
      {
        type: 'expand',
        expandPannel: variableExpander,
      },
      {
        label: 'Name',
        prop: 'reference',
        sortable: true,
      },
      {
        label: 'Type',
        prop: 'type',
        sortable: true,
      },
      {
        label: 'Occurrences',
        prop: 'occurrences',
        sortable: true,
      },
    ],
  };

  return columnDefinitions[type];
};

export default getTableColumns;
