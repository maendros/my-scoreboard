import { pubsub, MATCH_ADDED } from "@/graphql/pubsub";

const matchSubscriptionResolvers = {
  Subscription: {
    matchAdded: {
      subscribe: () => pubsub.asyncIterator([MATCH_ADDED]),
    },
  },
};

export default matchSubscriptionResolvers;
