import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography } from '@material-ui/core';
import { Tag } from './tag';
import { Trigger } from './trigger';
import { Variable } from './variable';

import { State, Element } from '../../../store/types';

const useStyles = makeStyles((theme) => ({
  elementName: {
    paddingBottom: theme.spacing(1),
    borderBottomColor: theme.palette.divider,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  },
  content: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

export const ContainerElement: React.FC = () => {
  const classes = useStyles();

  const { currentElement } = useSelector((state: State) => state);
  const { category, reference } = currentElement as Element;

  let contentElement;
  if (category === 'tags') {
    contentElement = <Tag />;
  }
  if (category === 'triggers') {
    contentElement = <Trigger />;
  }
  if (category === 'variables') {
    contentElement = <Variable />;
  }

  return (
    <Paper className={classes.content} elevation={4}>
      {currentElement && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center" className={classes.elementName}>
              {reference}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {contentElement}
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};
