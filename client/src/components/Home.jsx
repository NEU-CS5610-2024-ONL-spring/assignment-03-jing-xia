import { useAuth0 } from "@auth0/auth0-react";

export default function Home() {
  const { loginWithRedirect } = useAuth0();
  return (
    <div className="home">
      <h1>Assignment 3</h1>
      {/* test login */}
      <button onClick={() => loginWithRedirect()}>Log In</button>
    </div>
  );
}
