import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  errorPaper: {
    margin: theme.spacing(10),
  },
  errorElement: {
    minHeight: '40vh',
  },
}));


export default function ErrorComponent() {
  const classes = useStyles();
  return (
    <Paper className={classes.errorPaper}>
      <Grid direction="column" justify="center" alignItems="center" container spacing={3} className={classes.errorElement}>
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
