import userQueryResolvers from "./queries/user";
import matchQueryResolvers from "./queries/match";
import leagueTableQueryResolvers from "./queries/leagueTable";
import matchMutationResolvers from "./mutations/match";
import matchSubscriptionResolvers from "./subscriptions/match";
import matchTypeResolvers from "./types/matchType";

const resolvers = {
  Query: {
    ...userQueryResolvers.Query,
    ...matchQueryResolvers.Query,
    ...leagueTableQueryResolvers.Query,
  },
  Mutation: {
    ...matchMutationResolvers.Mutation,
  },
  Subscription: {
    ...matchSubscriptionResolvers.Subscription,
  },
  Match: {
    ...matchTypeResolvers.Match,
  },
};

export default resolvers;
