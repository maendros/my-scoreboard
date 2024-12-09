import { gql } from "graphql-tag";

const typeDefs = gql`
  scalar GraphQLJSON

  type Profile {
    color: String
    logo: String
    # Include other profile fields if necessary
  }

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
    isGamingLeague: Boolean!
    size: Int!
  }

  type Fixture {
    id: Int!
    league: League
    homeTeam: Team!
    awayTeam: Team!
    homeScore: Int!
    awayScore: Int!
    playedAt: String!
    homeTeamDetails: GraphQLJSON
    awayTeamDetails: GraphQLJSON
  }

  type GroupedFixtures {
    day: String!
    matches: [Fixture!]!
  }

  type GamingTeam {
    id: Int!
    name: String!
  }

  type Query {
    gamingTeams: [GamingTeam!]!
    possibleFormations: [String!]!
  }

  input LeagueInput {
    name: String!
    profile: GraphQLJSON
    isGamingLeague: Boolean!
    size: Int!
  }

  input FixtureInput {
    leagueId: Int! # Ensure leagueId is required
    homeTeamId: Int!
    awayTeamId: Int!
    homeScore: Int!
    awayScore: Int!
    playedAt: String!
    homeTeamDetails: GraphQLJSON
    awayTeamDetails: GraphQLJSON
  }

  input TeamInput {
    name: String!
    profile: GraphQLJSON
  }

  type GroupedFixtures {
    day: String! # The date for the fixtures (e.g., "2024-12-05")
    matches: [Fixture!]! # Array of fixtures for that day
  }

  type LeagueStats {
    wins: Int!
    losses: Int!
    draws: Int!
  }

  type TeamVsTeamStats {
    team1Wins: Int!
    team2Wins: Int!
    draws: Int!
  }

  type TeamPerformanceEvolution {
    teamId: Int!
    leagueId: Int
    performanceData: [PerformanceMetric!]!
  }

  type PerformanceMetric {
    matchNumber: Int!
    date: String!
    opponent: String!
    result: String!
    points: Int!
    cumulativePoints: Int!
    goalDifference: Int!
    cumulativeGoalDifference: Int!
  }

  type LeagueProgression {
    leagueId: Int!
    teams: [TeamProgression!]!
  }

  type TeamProgression {
    teamId: Int!
    teamName: String!
    progressionPoints: [Int!]!
    progressionPosition: [Int!]!
  }

  type Query {
    leagues: [League!]!
    fixtures(leagueId: Int): [Fixture!]!
    teams: [Team!]!
    league(id: Int!): League!
    leagueTable(leagueId: Int!): [LeagueTableEntry!]!
    teamDetails(id: Int!): Team
    leagueStats(teamId: Int!, leagueId: Int): LeagueStats
    teamVsTeamStats(
      team1Id: Int!
      team2Id: Int!
      leagueId: Int
    ): TeamVsTeamStats
    groupedFixtures(leagueId: Int, daysLimit: Int): [GroupedFixtures!]!
    teamPerformanceEvolution(teamId: Int!, leagueId: Int): TeamPerformanceEvolution!
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
