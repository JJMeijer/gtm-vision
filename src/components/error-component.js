import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  errorElement: {
    margin: theme.spacing(5),
    minHeight: '40vh',
  },
}));


export default function ErrorComponent() {
  const classes = useStyles();
  return (
    <Paper>
      <Grid
        direction="column"
        justify="center"
        alignItems="center"
        container
        spacing={3}
        className={classes.errorElement}
      >
        <Grid item xs={12}>
          <Typography variant="h4">Something went wrong :(</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" color="secondary" onClick={() => window.location.reload()}>Reload</Button>
        </Grid>
      </Grid>
    </Paper>

  );
}
