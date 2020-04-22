import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 500,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  select: {
    width: '25%',
    marginLeft: theme.spacing(1),
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const inputOptions = {
  GTMID: {
    placeholder: 'GTM-NTQ25T',
    endpoint: '/api/gtm',
    validateValue: value => !!value.match(/^GTM-[0-9A-Z]{4,7}$/),
    validateMessage: 'The ID you provided is not valid. a valid GTM container ID looks like "GTM-XXXXXX"',
    invalidResponseMessage: 'Could not find GTM container for provided ID',
  },
  URL: {
    placeholder: 'https://www.digital-power.com',
    endpoint: '/api/www',
    validateValue: value => !!value.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/),
    validateMessage: 'The URL you provided is not valid',
    invalidResponseMessage: 'Could not find GTM container at provided URL',
  },
};

export default function SearchBar(props) {
  const { resultCallback, loadingCallback } = props;
  const [inputValue, setInputValue] = useState('GTM-NTQ25T'); // GTM-NTQ25T
  const [inputType, setInputType] = useState('GTMID');
  const [inputValid, setInputValid] = useState(true);
  const [responseValid, setResponseValid] = useState(true);
  const {
    placeholder,
    endpoint,
    validateValue,
    validateMessage,
    invalidResponseMessage,
  } = inputOptions[inputType];

  const handleTypeChange = (event) => {
    setInputType(event.target.value);
    setInputValue('');
    setInputValid(true);
    setResponseValid(true);
    resultCallback(null);
    loadingCallback(false);
  };

  const handleValueChange = (event) => {
    setInputValue(event.target.value);
    setInputValid(true);
    setResponseValid(true);
    resultCallback(null);
    loadingCallback(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setResponseValid(true);

    const isInputValid = validateValue(inputValue);
    setInputValid(isInputValid);

    if (isInputValid) {
      loadingCallback(true);
      fetch(`${document.location.origin}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: inputValue,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            setResponseValid(false);
            loadingCallback(false);
            throw new Error(response.statusText);
          }
          return response;
        })
        .then(response => response.json())
        .then(({ container, errorMessage }) => {
          if (container) {
            const { resource } = container;
            setResponseValid(true);
            resultCallback(resource);
          }

          if (errorMessage) {
            setResponseValid(false);
            loadingCallback(false);
          }
        })
        .catch(() => {
          setResponseValid(false);
          return null;
        });
    }
  };

  const classes = useStyles();
  return (
    <Paper dp="20" component="form" className={classes.root} onSubmit={handleSubmit}>
      <Select
        className={classes.select}
        value={inputType}
        onChange={handleTypeChange}
        disableUnderline
      >
        <MenuItem value="GTMID">GTM ID</MenuItem>
        <MenuItem value="URL">URL</MenuItem>
      </Select>

      <Divider className={classes.divider} orientation="vertical" />

      <Tooltip
        title={!inputValid ? validateMessage : invalidResponseMessage}
        open={!inputValid || !responseValid}
        TransitionComponent={Zoom}
        arrow
        disableFocusListener
        disableHoverListener
        disableTouchListener
      >
        <TextField
          className={classes.input}
          placeholder={placeholder}
          onChange={handleValueChange}
          value={inputValue}
          InputProps={{
            disableUnderline: true,
          }}
        />
      </Tooltip>

      <IconButton type="submit" className={classes.iconButton}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

SearchBar.propTypes = {
  resultCallback: PropTypes.func.isRequired,
  loadingCallback: PropTypes.func.isRequired,
};
