import NodeCache from 'node-cache';

// Setup cache
const cachingTime = 600; // seconds
const containerCache = new NodeCache({
  stdTTL: cachingTime,
});

export default containerCache;
