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

import { sendError } from '../utility';

const useStyles = makeStyles(theme => ({
  searchbar: {
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
  tooltip: {
    fontSize: '90%',
  },
}));

const inputOptions = {
  GTMID: {
    placeholder: 'GTM-NTQ25T',
    endpoint: '/api/gtm',
    validateValue: value => !!value.match(/^GTM-[0-9A-Z]{4,7}$/),
    validateMessage: 'The ID you provided is not valid. a valid GTM container ID looks like "GTM-XXXXXX"',
  },
  URL: {
    placeholder: 'https://www.digital-power.com',
    endpoint: '/api/www',
    validateValue: value => !!value.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/),
    validateMessage: 'The URL you provided is not valid',
  },
};

export default function SearchBar(props) {
  const classes = useStyles();
  const { pushApiResponse, setLoadingState } = props;
  const [inputValue, setInputValue] = useState('GTM-P9Q4QS');
  const [inputType, setInputType] = useState('GTMID');
  const [inputValid, setInputValid] = useState(true);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [responseValid, setResponseValid] = useState(true);
  const [invalidResponseMessage, setInvalidResponseMessage] = useState('');
  const {
    placeholder,
    endpoint,
    validateValue,
    validateMessage,
  } = inputOptions[inputType];

  const handleTypeChange = (event) => {
    setInputType(event.target.value);
    setInputValue('');
    setInputValid(true);
    setResponseValid(true);
    pushApiResponse(null);
    setLoadingState(false);
  };

  const handleValueChange = (event) => {
    const trimmedValue = event.target.value.trim();
    if (inputValue !== trimmedValue) {
      setInputValue(trimmedValue);
      setInputValid(true);
      setResponseValid(true);
      pushApiResponse(null);
      setLoadingState(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setResponseValid(true);

    const isInputValid = validateValue(inputValue);
    setInputValid(isInputValid);

    if (isInputValid) {
      setLoadingState(true);
      setInputDisabled(true);
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
            throw new Error(response.statusText);
          }
          return response;
        })
        .then(response => response.json())
        .then(({ container: { resource: data } = {}, gtmId, clientFeedbackMessage }) => {
          if (data) {
            setResponseValid(true);
            pushApiResponse({ data, gtmId });
            setInputDisabled(false);
          }

          if (clientFeedbackMessage) {
            setResponseValid(false);
            setLoadingState(false);
            setInputDisabled(false);
            setInvalidResponseMessage(clientFeedbackMessage);
          }
        })
        .catch((e) => {
          setResponseValid(false);
          setLoadingState(false);
          setInputDisabled(false);
          setInvalidResponseMessage('An unexpected error occured :(');
          sendError(e);
          return null;
        });
    }
  };

  return (
    <Paper dp="20" component="form" className={classes.searchbar} onSubmit={handleSubmit}>
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
        classes={{ tooltip: classes.tooltip }}
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
          // eslint-disable-next-line react/jsx-no-duplicate-props
          inputProps={{ spellCheck: 'false' }}
        />
      </Tooltip>

      <IconButton type="submit" className={classes.iconButton} disabled={inputDisabled}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

SearchBar.propTypes = {
  pushApiResponse: PropTypes.func.isRequired,
  setLoadingState: PropTypes.func.isRequired,
};
