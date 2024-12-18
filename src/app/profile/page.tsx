"use client";

import { useQuery, gql } from "@apollo/client";

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      name
      email
      image
      role
    }
  }
`;

export default function ProfilePage() {
  const { data: userData, loading } = useQuery(GET_CURRENT_USER);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-base-darker rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          {userData?.me?.image ? (
            <img
              src={userData.me.image}
              alt={userData.me.name}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-2xl text-gray-600">
                {userData?.me?.name?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{userData?.me?.name}</h1>
            <p className="text-gray-500">{userData?.me?.email}</p>
            <span className="inline-block px-2 py-1 text-sm rounded bg-blue-100 text-blue-800 mt-2">
              {userData?.me?.role}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">About Me</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-base p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Games Played</h3>
                <p className="text-2xl font-bold">42</p>
              </div>
              <div className="bg-base p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Win Rate</h3>
                <p className="text-2xl font-bold">65%</p>
              </div>
              <div className="bg-base p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Total Score</h3>
                <p className="text-2xl font-bold">1,337</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-500">Yesterday</p>
                <p>Won a match in Premier League</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm text-gray-500">3 days ago</p>
                <p>Joined a new tournament</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-sm text-gray-500">1 week ago</p>
                <p>Achieved new high score</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
