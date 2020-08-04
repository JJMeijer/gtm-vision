import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  TextField,
  IconButton,
  Select,
  MenuItem,
  Divider,
  Tooltip,
  Zoom,
} from '@material-ui/core';

import SearchIcon from '@material-ui/icons/Search';

import { sendError } from './send-error';

import { UPDATE_CONTAINER, RESET_CONTAINER, UPDATE_LOADING_STATE } from '../store/constants';

const useStyles = makeStyles((theme) => ({
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

interface InputOptions {
  [key: string]: {
    placeholder: string;
    endpoint: string;
    validateValue: (value: string) => boolean;
    validateMessage: string;
  };
}

const inputOptions: InputOptions = {
  GTMID: {
    placeholder: 'GTM-NTQ25T',
    endpoint: '/api/gtm',
    validateValue: (value: string) => !!value.match(/^GTM-[0-9A-Z]{4,7}$/),
    validateMessage:
      'The ID you provided is not valid. a valid GTM container ID looks like "GTM-XXXXXX"',
  },
  URL: {
    placeholder: 'https://www.digital-power.com',
    endpoint: '/api/www',
    validateValue: (value: string) =>
      !!value.match(
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
      ),
    validateMessage: 'The URL you provided is not valid',
  },
};

export const SearchBar: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState('GTMID');
  const [inputValid, setInputValid] = useState(true);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [responseValid, setResponseValid] = useState(true);
  const [invalidResponseMessage, setInvalidResponseMessage] = useState('');
  const { placeholder, endpoint, validateValue, validateMessage } = inputOptions[inputType];

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setInputType(event.target.value as string);
    setInputValue('');
    setInputValid(true);
    setResponseValid(true);

    dispatch({
      type: RESET_CONTAINER,
    });

    dispatch({
      type: UPDATE_LOADING_STATE,
      payload: false,
    });
  };

  const handleValueChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    const trimmedValue = value.trim();
    if (inputValue !== trimmedValue) {
      setInputValue(trimmedValue);
      setInputValid(true);
      setResponseValid(true);

      dispatch({
        type: RESET_CONTAINER,
      });

      dispatch({
        type: UPDATE_LOADING_STATE,
        payload: false,
      });
    }
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setResponseValid(true);

    const isInputValid = validateValue(inputValue);
    setInputValid(isInputValid);

    if (isInputValid) {
      dispatch({
        type: UPDATE_LOADING_STATE,
        payload: true,
      });

      setInputDisabled(true);

      fetch(`${document.location.origin}${endpoint}?value=${inputValue}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response;
        })
        .then((response) => response.json())
        .then(({ parsedContainer = {}, gtmId, message }) => {
          if (parsedContainer) {
            setResponseValid(true);
            setInputDisabled(false);

            dispatch({
              type: UPDATE_CONTAINER,
              payload: {
                container: parsedContainer,
                gtmId: gtmId,
              },
            });
          }

          if (message) {
            setResponseValid(false);

            dispatch({
              type: UPDATE_LOADING_STATE,
              payload: false,
            });

            setInputDisabled(false);
            setInvalidResponseMessage(message);
          }
        })
        .catch((e) => {
          setResponseValid(false);

          dispatch({
            type: UPDATE_LOADING_STATE,
            payload: false,
          });

          setInputDisabled(false);
          setInvalidResponseMessage('An unexpected error occured :(');
          sendError(e);
          return null;
        });
    }
  };

  return (
    <Paper elevation={20} component="form" className={classes.searchbar} onSubmit={handleSubmit}>
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
          inputProps={{ spellCheck: 'false' }}
        />
      </Tooltip>

      <IconButton type="submit" className={classes.iconButton} disabled={inputDisabled}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};
