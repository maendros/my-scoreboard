import userQueryResolvers from "./queries/user";
import matchQueryResolvers from "./queries/match";
import leagueTableQueryResolvers from "./queries/leagueTable";
import matchMutationResolvers from "./mutations/match";
import matchSubscriptionResolvers from "./subscriptions/match";
import matchTypeResolvers from "./types/matchType";
import userMutationResolvers from "./mutations/user";
import { GraphQLJSON } from "graphql-scalars";

const resolvers = {
  Query: {
    ...userQueryResolvers.Query,
    ...matchQueryResolvers.Query,
    ...leagueTableQueryResolvers.Query,
  },
  Mutation: {
    ...matchMutationResolvers.Mutation,
    ...userMutationResolvers.Mutation,
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
