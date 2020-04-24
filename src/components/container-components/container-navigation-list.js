import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles(() => ({
  elementList: {
    height: 600,
  },
  elementName: {
    marginRight: 'auto',
    textAlign: 'left',
    maxWidth: '100%',
  },
  elementNameWrapper: {
    alignItems: 'baseline',
  },
}));

export default function ContainerNavigationList(props) {
  const classes = useStyles();
  const { listElements, pushElementIndexChange, elementIndex } = props;

  const handleElementChange = (event, newElementIndex) => {
    pushElementIndexChange(newElementIndex);
  };

  const listElementsTabs = useMemo(() => listElements.map(item => (
    <Tab
      key={item.reference}
      label={item.reference}
      className={classes.elementName}
      classes={{ wrapper: classes.elementNameWrapper }}
    />
  )), [listElements]);

  return (
    <Paper elevation={2}>
      <Tabs
        className={classes.elementList}
        orientation="vertical"
        variant="scrollable"
        value={elementIndex}
        onChange={handleElementChange}
      >
        {listElementsTabs}
      </Tabs>
    </Paper>
  );
}

ContainerNavigationList.propTypes = {
  listElements: PropTypes.arrayOf(
    PropTypes.shape({
      reference: PropTypes.string.isRequired,
    }),
  ).isRequired,
  pushElementIndexChange: PropTypes.func.isRequired,
  elementIndex: PropTypes.number.isRequired,
};
