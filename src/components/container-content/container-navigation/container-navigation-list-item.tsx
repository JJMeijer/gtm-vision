import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { State } from '../../../store/types';
import { UPDATE_ELEMENT } from '../../../store/constants';
import { CSSProperties } from 'react';

/**
 * Styling
 */
const useStyles = makeStyles((theme) => ({
  elementName: {
    justifyContent: 'left',
    color: theme.palette.text.secondary,
    textAlign: 'left',
  },
  activeElement: {
    fontWeight: 'bold',
    color: theme.palette.text.primary,
  },
}));

/**
 * Element specific Types
 */
interface ListItemProps {
  index: number;
  style: CSSProperties;
}

/**
 * Item in the list of elements in the current tab. Clicking will
 * change the active element.
 */
export const ListItem: React.FC<ListItemProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { index, style } = props;

  const {
    currentElements,
    navigation: { currentIndex },
  } = useSelector((state: State) => state);

  const handleClick = () => {
    dispatch({
      type: UPDATE_ELEMENT,
      payload: index,
    });
  };

  const activeClass = index === currentIndex ? classes.activeElement : '';

  return (
    <Button
      variant="text"
      style={style}
      key={currentElements && currentElements[currentIndex].reference}
      className={`${classes.elementName} ${activeClass}`}
      onClick={handleClick}
    >
      {currentElements && currentElements[index].reference}
    </Button>
  );
};
