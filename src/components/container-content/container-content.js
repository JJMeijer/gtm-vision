import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Zoom } from '@material-ui/core';

import ContainerNavigation from './container-navigation';
import ContainerElement from './container-element';

const useStyles = makeStyles(theme => ({
  containerContent: {
    marginTop: '-17vh',
    minHeight: '90vh',
    background: theme.palette.background.default,
    borderRadius: 4,
  },
}));

export default function ContainerContent(props) {
  const classes = useStyles();
  const { parsedData } = props;

  const [currentTabName, pushNewTabName] = useState('tags');
  const [currentElementIndexes, setCurrentElementIndexes] = useState({
    tags: 0,
    triggers: 0,
    variables: 0,
  });

  const pushNewElementIndex = (newElementIndex) => {
    setCurrentElementIndexes(previousElementIndexes => ({
      ...previousElementIndexes,
      [currentTabName]: newElementIndex,
    }));
    return null;
  };

  const navigation = (newTabName, newElementReference) => {
    const newElementIndex = parsedData[newTabName].findIndex((item) => {
      if (item.reference === newElementReference) {
        return true;
      }
      return false;
    });

    pushNewTabName(newTabName);
    setCurrentElementIndexes(previousElementIndexes => ({
      ...previousElementIndexes,
      [newTabName]: newElementIndex,
    }));
  };

  // Scroll into view (only when data changes)
  const containerContentId = 'container-content';
  useEffect(() => document.getElementById(containerContentId).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' }), [parsedData]);

  return (
    <Zoom in timeout={425}>
      <Grid className={classes.containerContent} id={containerContentId} container spacing={3}>
        <Grid item xs={3}>
          <ContainerNavigation
            parsedData={parsedData}
            currentTabName={currentTabName}
            currentElementIndex={currentElementIndexes[currentTabName]}
            pushNewTabName={pushNewTabName}
            pushNewElementIndex={pushNewElementIndex}
          />
        </Grid>
        <Grid item xs={9}>
          <ContainerElement
            elementData={parsedData[currentTabName][currentElementIndexes[currentTabName]]}
            navigation={navigation}
          />
        </Grid>
      </Grid>
    </Zoom>
  );
}

ContainerContent.propTypes = {
  parsedData: PropTypes.shape({
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        reference: PropTypes.string.isRequired,
      }),
    ),
    triggers: PropTypes.arrayOf(
      PropTypes.shape({
        reference: PropTypes.string.isRequired,
      }),
    ),
    variables: PropTypes.arrayOf(
      PropTypes.shape({
        reference: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
};
