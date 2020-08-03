import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { ElementList, State } from '../../../store/types';
import { UPDATE_ELEMENT } from '../../../store/constants';

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

interface ListItemProps {
  data: ElementList;
  index: number;
  style
}

export const ListItem: React.FC<ListItemProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { index, style } = props;

  const { currentElements, navigation: { currentIndex } } = useSelector((state: State) => state);
  
  const handleClick() => {
    dispatch({
      type: UPDATE_ELEMENT,
      payload: index,
    });
  }

  const activeClass = index === currentIndex ? classes.activeElement : '';

  return (
    <Button
      variant="text"
      style={style}
      key={currentElements[currentIndex].reference}
      className={`${classes.elementName} ${activeClass}`}
      onClick={handleClick}
    >
      {listElements[index].reference}
    </Button>
  );
};

ListItem.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.shape({
    height: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    position: PropTypes.string.isRequired,
    top: PropTypes.number.isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};
