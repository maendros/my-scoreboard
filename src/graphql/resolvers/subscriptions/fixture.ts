import { pubsub, FIXTURE_ADDED } from "@/graphql/pubsub";

const fixtureSubscriptionResolvers = {
  Subscription: {
    fixtureAdded: {
      subscribe: () => pubsub.asyncIterator([FIXTURE_ADDED]),
    },
  },
};

export default fixtureSubscriptionResolvers;
