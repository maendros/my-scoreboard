import { gql, useQuery } from "@apollo/client";

const TEAM_FIELDS = gql`
  fragment TeamFields on Team {
    id
    name
    profile
    userId
  }
`;
const GET_USER_TEAMS = gql`
  ${TEAM_FIELDS}
  query GetUserTeams($userId: Int!) {
    myTeams(userId: $userId) {
      ...TeamFields
    }
  }
`;

const GET_ALL_TEAMS_AND_USERS = gql`
  ${TEAM_FIELDS}
  query GetAllTeamsAndUsers {
    teams {
      ...TeamFields
      user {
        id
        name
        email
      }
    }
    users {
      id
      email
      name
      role
    }
  }
`;

const UPDATE_TEAM = gql`
  ${TEAM_FIELDS}
  mutation UpdateTeam($id: Int!, $team: TeamInput!) {
    updateTeam(id: $id, team: $team) {
      ...TeamFields
    }
  }
`;

const UPDATE_USER_TEAM = gql`
  ${TEAM_FIELDS}
  mutation UpdateUserTeam($id: Int!, $team: TeamInput!) {
    updateTeam(id: $id, team: $team) {
      ...TeamFields
    }
  }
`;

const ASSIGN_TEAM = gql`
  ${TEAM_FIELDS}
  mutation AssignTeam($teamId: Int!, $userId: Int) {
    assignTeam(teamId: $teamId, userId: $userId) {
      ...TeamFields
    }
  }
`;
export {
  TEAM_FIELDS,
  GET_USER_TEAMS,
  GET_ALL_TEAMS_AND_USERS,
  UPDATE_TEAM,
  UPDATE_USER_TEAM,
  ASSIGN_TEAM,
};
