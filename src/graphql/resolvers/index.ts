import teamQueryResolvers from "./queries/team";
import fixtureQueryResolvers from "./queries/fixtures";
import leagueQueryResolvers from "./queries/league";
import fixtureMutationResolvers from "./mutations/fixture";

import teamMutationResolvers from "./mutations/team";
import { GraphQLJSON } from "graphql-scalars";
import leagueResolvers from "./mutations/league";
import fixtureTypeResolvers from "./types/fixtureType";
import fixtureSubscriptionResolvers from "./subscriptions/fixture";
import gamingResolvers from "./queries/gamingResolvers";

const resolvers = {
  Query: {
    ...teamQueryResolvers.Query,
    ...fixtureQueryResolvers.Query,
    ...leagueQueryResolvers.Query,
    ...gamingResolvers.Query,
  },
  Mutation: {
    ...fixtureMutationResolvers.Mutation,
    ...teamMutationResolvers.Mutation,
    ...leagueResolvers.Mutation,
  },
  Subscription: {
    ...fixtureSubscriptionResolvers.Subscription,
  },
  Fixture: {
    ...fixtureTypeResolvers.Fixture,
  },
  GraphQLJSON,
};

export default resolvers;
