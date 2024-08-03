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
    addUser(name: String!, email: String!): User!
    addMatches(matches: [MatchInput!]!): [Match!]!
  }

  type Subscription {
    matchAdded: [Match!]!
  }
`;

export default typeDefs;
