import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ContainerElement from './container-element';

const useStyles = makeStyles(theme => ({
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
  content: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

export default function ContainerElementList(props) {
  const classes = useStyles();
  const {
    tabContent,
    currentTabIndex,
    setCurrentTabIndex,
    getElementIndex,
  } = props;

  const [elementIndexes, setElementIndexes] = useState([0, 0, 0]);

  const listItems = useMemo(() => tabContent.map(item => (
    <Tab
      key={item.reference}
      label={item.reference}
      className={classes.elementName}
      classes={{ wrapper: classes.elementNameWrapper }}
    />
  )), [tabContent]);

  const handleRowChange = (event, newElementIndex) => {
    setElementIndexes(prevState => prevState.map((previousElementIndex, tabIndex) => {
      if (tabIndex === currentTabIndex) {
        return newElementIndex;
      }
      return previousElementIndex;
    }));
  };

  const navigation = (newTabIndex, elementReference) => {
    const newElementIndex = getElementIndex(newTabIndex, elementReference);

    // Navigate to new Tab
    setCurrentTabIndex(newTabIndex);

    setElementIndexes(prevState => (prevState.map((previousElementIndex, tabIndex) => {
      if (tabIndex === newTabIndex) {
        return newElementIndex;
      }
      return previousElementIndex;
    })));
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper>
            <Tabs
              className={classes.elementList}
              scrollButtons="on"
              orientation="vertical"
              variant="scrollable"
              value={elementIndexes[currentTabIndex]}
              onChange={handleRowChange}
            >
              {listItems}
            </Tabs>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper className={classes.content}>
            {tabContent[elementIndexes[currentTabIndex]] && (
              <ContainerElement
                data={tabContent[elementIndexes[currentTabIndex]]}
                navigation={navigation}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

ContainerElementList.propTypes = {
  tabContent: PropTypes.arrayOf(
    PropTypes.shape({
      reference: PropTypes.string.isRequired,
    }),
  ).isRequired,
  currentTabIndex: PropTypes.number.isRequired,
  setCurrentTabIndex: PropTypes.func.isRequired,
  getElementIndex: PropTypes.func.isRequired,
};
