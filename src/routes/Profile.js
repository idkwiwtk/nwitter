import Nweet from "components/Nweet";
import { authService, dbService } from "fbInstance";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Profile = ({ refreshUser, user }) => {
  const [nweets, setNweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(user.displayName || "");
  const navigate = useNavigate();

  const onChange = (e) => {
    setNewDisplayName((prev) => (prev = e.target.value));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (newDisplayName !== user.displayName) {
      await updateProfile(user, { displayName: newDisplayName });
      console.log("update profile");
      refreshUser();
    }
  };

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  useEffect(() => {
    getAllNweets();
  }, []);

  const getAllNweets = async () => {
    const nweetsRef = collection(dbService, "nweets");
    const q = await query(
      nweetsRef,
      where("uid", "==", user.uid),
      orderBy("createAt", "asc")
    );

    const tnweets = await getDocs(q);

    console.log(tnweets);

    const nweetsArr = tnweets.docs.map((item) => ({ ...item.data() }));

    console.log(nweetsArr);
    setNweets(nweetsArr);

    // console.log(myNweets);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="unknown"
          value={newDisplayName}
          onChange={onChange}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
      <hr />
      {nweets.map((n) => (
        <Nweet nweetObj={n} isOwner={true} />
      ))}
    </>
  );
};

export default Profile;
