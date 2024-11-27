import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();
const MATCH_ADDED = "MATCH_ADDED";

const matchSubscriptionResolvers = {
  Subscription: {
    matchAdded: {
      subscribe: () => pubsub.asyncIterator([MATCH_ADDED]),
    },
  },
};

export default matchSubscriptionResolvers;
