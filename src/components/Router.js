import React, { useState, useEffect } from "react";
import {
  HashRouter,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "./Navigation";

const Router = ({ refreshUser, isLoggIn, user }) => {
  return (
    <HashRouter>
      {isLoggIn ? <Navigation displayName={user.displayName} /> : null}
      <Routes>
        {isLoggIn ? (
          <>
            <Route exact path="/" element={<Home user={user} />}></Route>
            <Route
              exact
              path="/profile"
              element={
                <Profile refreshUser={refreshUser} user={user} />
              }></Route>
          </>
        ) : (
          <>
            <Route exact path="/" element={<Auth />}></Route>
          </>
        )}
      </Routes>
    </HashRouter>
  );
};

export default Router;
