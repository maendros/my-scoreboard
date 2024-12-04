import { gql } from "graphql-tag";

const typeDefs = gql`
  scalar GraphQLJSON

  type Team {
    id: Int!
    name: String!
    profile: GraphQLJSON
    leagues: [League!]!
    homeMatches: [Match!]!
    awayMatches: [Match!]!
  }

  type LeagueTableEntry {
    team: Team!
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

  type League {
    id: Int!
    name: String!
    profile: GraphQLJSON
    teams: [Team!]!
    matches: [Match!]!
  }

  type Match {
    id: Int!
    league: League
    homeTeam: Team!
    awayTeam: Team!
    homeScore: Int!
    awayScore: Int!
    playedAt: String!
  }

  input LeagueInput {
    name: String!
    profile: GraphQLJSON
  }

  input MatchInput {
    leagueId: Int
    homeTeamId: Int!
    awayTeamId: Int!
    homeScore: Int!
    awayScore: Int!
    playedAt: String!
  }

  input TeamInput {
    name: String!
    profile: GraphQLJSON
  }

  type Query {
    leagues: [League!]!
    matches: [Match!]!
    teams: [Team!]!
    leagueTable(leagueId: Int!): [LeagueTableEntry!]!
  }

  type Mutation {
    addLeague(league: LeagueInput!): League!
    updateLeague(id: Int!, league: LeagueInput!): League!
    deleteLeague(id: Int!): Boolean!
    addTeamsToLeague(leagueId: Int!, teamIds: [Int!]!): League!

    addTeam(team: TeamInput!): Team!
    updateTeam(id: Int!, team: TeamInput!): Team!
    deleteTeam(id: Int!): Boolean!

    addMatch(match: MatchInput!): Match!
    updateMatch(id: Int!, match: MatchInput!): Match!
    deleteMatch(id: Int!): Boolean!
  }

  type Subscription {
    matchAdded: Match! 
  }
`;

export default typeDefs;
