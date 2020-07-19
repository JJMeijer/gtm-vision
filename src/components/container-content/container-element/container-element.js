import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography } from '@material-ui/core';
import Tag from './tag';
import Trigger from './trigger';
import Variable from './variable';

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

export default function ContainerElement(props) {
  const classes = useStyles();
  const { elementData, navigation } = props;
  const { category, reference } = elementData;

  let contentElement;
  if (category === 'tags') {
    contentElement = <Tag elementData={elementData} navigation={navigation} />;
  }
  if (category === 'triggers') {
    contentElement = <Trigger elementData={elementData} navigation={navigation} />;
  }
  if (category === 'variables') {
    contentElement = <Variable elementData={elementData} navigation={navigation} />;
  }

  return (
    <Paper className={classes.content} elevation={4}>
      {elementData && (
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
}

ContainerElement.propTypes = {
  elementData: PropTypes.shape({
    category: PropTypes.string.isRequired,
    reference: PropTypes.string.isRequired,
  }).isRequired,
  navigation: PropTypes.func.isRequired,
};
