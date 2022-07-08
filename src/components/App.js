import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbInstance";
import {
  getIdToken,
  onAuthStateChanged,
  updateCurrentUser,
  UserInfo,
} from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggIn, setIsLoggIn] = useState(authService.getUser);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      console.log("auth change", user);
      if (user) {
        setIsLoggIn(true);
        setUserObj(user);
      } else {
        setIsLoggIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = async () => {
    // setUserObj(
    //   (prev) =>
    //     (prev = {
    //       displayName: authService.currentUser.displayName,
    //       uid: authService.currentUser.uid,
    //       photoURL: authService.currentUser.photoURL,
    //     })
    // );
    // setUserObj(Object.assign(userObj, authService.currentUser));
    // setUserObj(JSON.parse(JSON.stringify(authService.currentUser)));
    await updateCurrentUser(authService, authService.currentUser);
    setUserObj(authService.currentUser);
  };

  console.log(userObj);

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggIn={isLoggIn}
          user={userObj}
        />
      ) : (
        "Init..."
      )}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
