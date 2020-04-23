import { serverLogger } from '.';

const clientFeedbackMessages = {
  GTM_NOT_FOUND: {
    clientFeedbackMessage: 'Could not find Script for this GTM container',
    clientFeedbackCode: 1001,
  },
  GTM_PARSING_ERROR: {
    clientFeedbackMessage: 'Could not find expected content in GTM script',
    clientFeedbackCode: 1002,
  },
  SCRIPT_NOT_FOUND_FIRST: {
    clientFeedbackMessage: 'Could not find GTM script at the provided URL',
    clientFeedbackCode: 1003,
  },
  SCRIPT_NOT_FOUND_SECONDARY: {
    clientFeedbackMessage: 'The previous time this URL was searched there was no GTM script found.',
    clientFeedbackCode: 1004,
  },
  BROWSING_ERROR: {
    clientFeedbackMessage: 'The provided URL could not be reached',
    clientFeedbackCode: 1005,
  },
};

export default function createclientFeedback(clientFeedbackType, metadata) {
  const clientFeedbackInfo = clientFeedbackMessages[clientFeedbackType] || {
    clientFeedbackMessage: 'Unknown Error',
    clientFeedbackCode: 1000,
  };

  const { clientFeedbackMessage, clientFeedbackCode } = clientFeedbackInfo;
  serverLogger.info(`Client Error Message: ${clientFeedbackMessage}`, { ...metadata, clientFeedbackCode });

  return clientFeedbackInfo;
}
