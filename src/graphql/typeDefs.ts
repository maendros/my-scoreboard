import { gql } from "graphql-tag";

const typeDefs = gql`
  scalar GraphQLJSON
  type User {
    id: Int!
    name: String!
    email: String
    matchesHome: [Match!]!
    matchesAway: [Match!]!
    profile: GraphQLJSON # JSON field for properties like color
  }

  input UserInput {
    name: String!
    email: String
    profile: GraphQLJSON
  }

  type Match {
    id: ID!
    homeTeam: User!
    awayTeam: User!
    homeScore: Int!
    awayScore: Int!
    playedAt: String! # Updated from date to playedAt
  }

  input MatchInput {
    homeTeamId: ID!
    awayTeamId: ID!
    homeScore: Int!
    awayScore: Int!
    playedAt: String!
    userTeams: [UserTeamInput!] # Optional
  }

  input UserTeamInput {
    userId: ID!
    teamId: ID!
    isWinner: Boolean!
  }

  type LeagueTableEntry {
    team: User!
    played: Int!
    won: Int!
    drawn: Int!
    lost: Int!
    goalsFor: Int!
    goalsAgainst: Int!
    goalDifference: Int!
    points: Int!
    winRatio: Float!
  }

  type Query {
    users: [User!]!
    matches: [Match!]!
    leagueTable: [LeagueTableEntry!]!
  }

  type Mutation {
    addUser(user: UserInput!): User!
    addMatches(matches: [MatchInput!]!): [Match!]!
    updateUser(id: Int!, user: UserInput!): User!
    deleteUser(id: Int!): Boolean!
  }

  type Subscription {
    matchAdded: [Match!]!
  }
`;

export default typeDefs;
