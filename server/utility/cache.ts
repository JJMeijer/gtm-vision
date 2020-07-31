import NodeCache from 'node-cache';

// Setup cache
const cachingTime = 600; // seconds
export const cache = new NodeCache({
  stdTTL: cachingTime,
});
