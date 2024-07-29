// src/app/page.tsx
import UserList from "@/components/UserList";
import { ApolloProvider } from "@/components/ApolloProvider";

export default function Home() {
  return (
    <ApolloProvider>
      <div>
        <h1>Welcome to My Scoreboard</h1>
        <UserList />
      </div>
    </ApolloProvider>
  );
}
