import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:3000/api/graphql",
    fetch, // Use native fetch
  }),
  cache: new InMemoryCache(),
});

const ADD_USER = gql`
  mutation AddUser($name: String!, $email: String!) {
    addUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const ADD_MATCH = gql`
  mutation AddMatch(
    $homeTeamId: ID!
    $awayTeamId: ID!
    $homeScore: Int!
    $awayScore: Int!
  ) {
    addMatch(
      homeTeamId: $homeTeamId
      awayTeamId: $awayTeamId
      homeScore: $homeScore
      awayScore: $awayScore
    ) {
      id
      homeScore
      awayScore
    }
  }
`;

const users = [
  { name: "Panos", email: "panos@example.com" },
  { name: "Spyros", email: "spyros@example.com" },
  { name: "Stelios", email: "stelios@example.com" },
  { name: "Paschos", email: "paschos@example.com" },
  { name: "Mike", email: "mike@example.com" },
];

const matches = [
  { homeTeam: "Panos", awayTeam: "Stelios", homeScore: 1, awayScore: 0 },
  { homeTeam: "Stelios", awayTeam: "Spyros", homeScore: 2, awayScore: 0 },
  { homeTeam: "Mike", awayTeam: "Paschos", homeScore: 2, awayScore: 2 },
];

async function populateData() {
  const userIds: { [name: string]: number } = {};

  for (const user of users) {
    const result = await client.mutate({
      mutation: ADD_USER,
      variables: { name: user.name, email: user.email },
    });
    userIds[user.name] = parseInt(result.data.addUser.id, 10);
  }

  for (const match of matches) {
    await client.mutate({
      mutation: ADD_MATCH,
      variables: {
        homeTeamId: userIds[match.homeTeam],
        awayTeamId: userIds[match.awayTeam],
        homeScore: match.homeScore,
        awayScore: match.awayScore,
      },
    });
  }
}

populateData().then(() => {
  console.log("Data populated");
});
