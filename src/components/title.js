import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    title: {
      textAlign: 'center',
      color: 'white',
    },
  }))

export default function Title(props) {
    const { titleText } = props;

    const classes = useStyles();
    return (
        <Container className={classes.title}>
            <h1>{titleText}</h1>
        </Container>
    )
}