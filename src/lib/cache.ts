import NodeCache from "node-cache";

// 3 months in seconds: 3 * 30 * 24 * 60 * 60
export const teamCache = new NodeCache({ stdTTL: 7776000 });
