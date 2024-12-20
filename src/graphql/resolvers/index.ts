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
import authQueryResolvers from "./queries/auth";
import authMutationResolvers from "./mutations/auth";
import userQueryResolvers from "./queries/user";
import userMutationResolvers from "./mutations/user";

const resolvers = {
  Query: {
    ...teamQueryResolvers.Query,
    ...fixtureQueryResolvers.Query,
    ...leagueQueryResolvers.Query,
    ...gamingResolvers.Query,
    ...authQueryResolvers.Query,
    ...userQueryResolvers.Query,
  },
  Mutation: {
    ...fixtureMutationResolvers.Mutation,
    ...teamMutationResolvers.Mutation,
    ...leagueResolvers.Mutation,
    ...authMutationResolvers.Mutation,
    ...userMutationResolvers.Mutation,
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
