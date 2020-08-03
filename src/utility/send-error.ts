import { ErrorObject, CustomWindow } from '../../types/frontend';

declare const window: CustomWindow;

export const sendError = (error: ErrorObject): void => {
  const { name = 'Error', message = 'default error', stack = 'Stack missing' } = error.error;
  const gtmId = window.dataStore ? window.dataStore.gtmId || 'unknown' : 'No Data';

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
