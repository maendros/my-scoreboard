import { gql } from "graphql-tag";

const typeDefs = gql`
  scalar GraphQLJSON

  type Team {
    id: Int!
    name: String
    profile: GraphQLJSON
    leagues: [League!]!
    homeFixture: [Fixture!]!
    awayFixture: [Fixture!]!
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
    lastFiveMatches: [MatchResult!]!
  }

  type MatchResult {
    result: String!
  }

  type League {
    id: Int!
    name: String!
    profile: GraphQLJSON
    teams: [Team!]!
    fixtures: [Fixture!]!
  }

  type Fixture {
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

  input FixtureInput {
    leagueId: Int! # Ensure leagueId is required
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
    fixtures(leagueId: Int): [Fixture!]!
    teams: [Team!]!
    league(id: Int!): League!
    leagueTable(leagueId: Int!): [LeagueTableEntry!]!
  }

  type Mutation {
    addLeague(league: LeagueInput!): League!
    updateLeague(id: Int!, league: LeagueInput!): League!
    deleteLeague(id: Int!): Boolean!
    addTeamsToLeague(leagueId: Int!, teamIds: [Int!]!): League!
    removeTeamFromLeague(leagueId: Int!, teamId: Int!): League!

    addTeam(team: TeamInput!): Team!
    updateTeam(id: Int!, team: TeamInput!): Team!
    deleteTeam(id: Int!): Boolean!

    addFixtures(fixtures: [FixtureInput!]!): [Fixture!]!
    updateFixture(id: Int!, fixture: FixtureInput!): Fixture!
    deleteFixture(id: Int!): Boolean!
  }

  type Subscription {
    fixtureAdded: Fixture!
  }
`;

export default typeDefs;
