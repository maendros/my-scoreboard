import NodeCache from "node-cache";

// Declare global variable for the cache
declare global {
  var globalCache: NodeCache | undefined;
}

// Create singleton cache
if (!global.globalCache) {
  global.globalCache = new NodeCache({ stdTTL: 7776000 });
  console.log("Created new global cache instance");
}

const cache = global.globalCache;

cache.on("set", function (key, value) {
  console.log(
    `Cache SET: ${key}, value length: ${
      Array.isArray(value) ? value.length : "not array"
    }`
  );
});

cache.on("get", function (key, value) {
  console.log(`Cache GET: ${key}, value found: ${value !== undefined}`);
});

export const teamCache = cache;
