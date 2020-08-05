import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';

import { FixedSizeList } from 'react-window';

import { ListItem } from './container-navigation-list-item';

import { State } from '../../../store/types';

const listRef = React.createRef<FixedSizeList>();

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    minHeight: 600,
  },
  list: {
    '&::-webkit-scrollbar': {
      width: theme.spacing(2),
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      borderRadius: '4px',
      outline: '1px solid slategrey',
    },
    scrollbarColor: 'rgba(0,0,0,.1) transparent',
    scrollbarWidth: 'auto',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(1.5),
    right: theme.spacing(3),
  },
}));

export const ContainerNavigationList: React.FC = () => {
  const classes = useStyles();

  const {
    currentElements = [],
    navigation: { currentIndex },
  } = useSelector((state: State) => state);

  useEffect(() => {
    if (listRef.current !== null) {
      listRef.current.scrollToItem(currentIndex, 'smart');
    }
  });

  return (
    <div className={classes.root}>
      <FixedSizeList
        className={classes.list}
        ref={listRef}
        height={600}
        itemCount={currentElements.length}
        itemSize={55}
        width="100%"
        initialScrollOffset={currentIndex}
      >
        {ListItem}
      </FixedSizeList>
      <Fab
        size="small"
        className={classes.fab}
        onClick={() => listRef.current && listRef.current.scrollTo(0)}
      >
        <UpIcon />
      </Fab>
    </div>
  );
};
