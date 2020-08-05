import { serverLogger } from './loggers';

import { FeedbackMessage, FeedbackMessages } from '../types';

interface Metadata {
  [key: string]: string;
}

const feedbackMessages: FeedbackMessages = {
  GTM_NOT_FOUND: {
    message: 'Could not find Script for this GTM container',
    code: 1001,
  },
  GTM_PARSING_ERROR: {
    message: 'An error occurred during the parsing of the GTM Script',
    code: 1002,
  },
  SCRIPT_NOT_FOUND_FIRST: {
    message: 'Could not find GTM script at the provided URL',
    code: 1003,
  },
  SCRIPT_NOT_FOUND_SECONDARY: {
    message: 'The previous time this URL was searched there was no GTM script found.',
    code: 1004,
  },
  BROWSING_ERROR: {
    message: 'The provided URL could not be reached',
    code: 1005,
  },
  UNEXPECTED_GTM_URL: {
    message: 'The GTM URL has an unexpected format',
    code: 1006,
  },
};

export const createClientFeedback = (type: string, metadata: Metadata): FeedbackMessage => {
  const feedback = feedbackMessages[type] || {
    message: 'Unknown Error',
    code: 1000,
  };

  const { message, code } = feedback;
  serverLogger.info(`Client Error Message: ${message}`, { ...metadata, code });

  return feedback;
};
