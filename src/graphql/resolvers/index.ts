import teamQueryResolvers from "./queries/team";
import matchQueryResolvers from "./queries/match";
import leagueQueryResolvers from "./queries/league";
import matchMutationResolvers from "./mutations/match";
import matchSubscriptionResolvers from "./subscriptions/match";
import matchTypeResolvers from "./types/matchType";
import userMutationResolvers from "./mutations/team";
import { GraphQLJSON } from "graphql-scalars";
import leagueResolvers from "./mutations/league";

const resolvers = {
  Query: {
    ...teamQueryResolvers.Query,
    ...matchQueryResolvers.Query,
    ...leagueQueryResolvers.Query,
  },
  Mutation: {
    ...matchMutationResolvers.Mutation,
    ...userMutationResolvers.Mutation,
    ...leagueResolvers.Mutation
  },
  Subscription: {
    ...matchSubscriptionResolvers.Subscription,
  },
  Match: {
    ...matchTypeResolvers.Match,
  },
  GraphQLJSON,
};

export default resolvers;
