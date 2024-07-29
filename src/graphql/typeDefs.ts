import { gql } from "graphql-tag";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    matchesHome: [Match!]!
    matchesAway: [Match!]!
  }

  type Match {
    id: ID!
    homeTeam: User!
    awayTeam: User!
    homeScore: Int!
    awayScore: Int!
    date: String!
  }

  type Query {
    users: [User!]!
    matches: [Match!]!
  }

  type Mutation {
    addUser(name: String!, email: String!): User!
    addMatch(
      homeTeamId: ID!
      awayTeamId: ID!
      homeScore: Int!
      awayScore: Int!
    ): Match!
  }

  type Subscription {
    matchAdded: Match!
  }
`;

export default typeDefs;
