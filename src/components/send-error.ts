import { useSelector } from 'react-redux';

import { State } from '../store/types';

/**
 * Function specific type
 */
interface ErrorObject {
  error: Error;
}

/**
 * Function to send Frontend Errors to the backend. (For stackdriver logging)
 */
export const sendError = (error: ErrorObject): void => {
  const { name = 'Error', message = 'default error', stack = 'Stack missing' } = error.error;
  const { gtmId = 'Unknown' } = useSelector((state: State) => state);

  fetch(`${document.location.origin}/api/error`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      message,
      stack,
      gtmId,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
    })
    .catch((e) => {
      sendError(e);
    });
};
