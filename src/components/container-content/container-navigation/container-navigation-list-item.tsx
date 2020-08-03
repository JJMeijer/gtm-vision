import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { ElementList } from '../../../store/types';

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
  style: 
}

export const ListItem: React.FC<ListItemProps> = (props) => {
  const classes = useStyles();
  const { index, style } = props;
  const { listElements, pushElementIndexChange, currentElementIndex } = data;

  const { currentElements, navgiation: { currentIndex } = useSelector((state: State) => state);
  

  const activeClass = index === currentElementIndex ? classes.activeElement : '';

  return (
    <Button
      variant="text"
      style={style}
      key={listElements[index].reference}
      className={`${classes.elementName} ${activeClass}`}
      onClick={() => pushElementIndexChange(index)}
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
  data: PropTypes.shape({
    listElements: PropTypes.arrayOf(
      PropTypes.shape({
        reference: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
    currentElementIndex: PropTypes.number.isRequired,
    pushElementIndexChange: PropTypes.func.isRequired,
  }).isRequired,
};
