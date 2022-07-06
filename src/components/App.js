import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbInstance";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggIn, setIsLoggIn] = useState(authService.getUser);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      console.log(user);
      if (user) {
        setInit(true);
      }
    });
  }, []);

  console.log("authService", authService);

  return (
    <>
      <AppRouter isLoggIn={isLoggIn} />
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
