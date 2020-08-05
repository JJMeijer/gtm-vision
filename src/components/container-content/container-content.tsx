import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Zoom } from '@material-ui/core';

import { ContainerNavigation } from './container-navigation';
import { ContainerElement } from './container-element';

/**
 * Styling
 */
const useStyles = makeStyles((theme) => ({
  containerContent: {
    marginTop: '-17vh',
    minHeight: '90vh',
    background: theme.palette.background.default,
    borderRadius: 4,
  },
}));

/**
 * Parent element for the container navigation & container element blocks
 */
export const ContainerContent: React.FC = () => {
  const classes = useStyles();

  // Scroll into view (only when data changes)
  const containerContentId = 'container-content';
  useEffect(() => {
    const element = document.getElementById(containerContentId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }, []);

  return (
    <Zoom in timeout={425}>
      <Grid className={classes.containerContent} id={containerContentId} container spacing={3}>
        <Grid item xs={3}>
          <ContainerNavigation />
        </Grid>
        <Grid item xs={9}>
          <ContainerElement />
        </Grid>
      </Grid>
    </Zoom>
  );
};
