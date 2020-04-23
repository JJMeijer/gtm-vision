import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Trigger, Tag, Variable } from './container-element-components';

const useStyles = makeStyles(theme => ({
  elementName: {
    paddingBottom: theme.spacing(1),
    borderBottomColor: theme.palette.divider,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  },
}));

export default function ContainerElement(props) {
  const classes = useStyles();
  const { data, navigation } = props;
  const { category, reference } = data;

  let contentElement;
  if (category === 'tags') {
    contentElement = <Tag data={data} navigation={navigation} />;
  }
  if (category === 'triggers') {
    contentElement = <Trigger data={data} navigation={navigation} />;
  }
  if (category === 'variables') {
    contentElement = <Variable data={data} navigation={navigation} />;
  }

  return (
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
  );
}

ContainerElement.propTypes = {
  data: PropTypes.shape({
    category: PropTypes.string.isRequired,
    reference: PropTypes.string.isRequired,
  }).isRequired,
  navigation: PropTypes.func.isRequired,
};