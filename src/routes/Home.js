import { dbService, storageService } from "fbInstance";
import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  Query,
  snapshotEqual,
  where,
} from "firebase/firestore";
import Nweet from "components/Nweet";
import { findRenderedDOMComponentWithClass } from "react-dom/test-utils";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Home = ({ user }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [selectImage, setSelectImage] = useState("");

  const onChange = (e) => {
    setNweet(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let downloadUrl = "";

    if (selectImage !== "") {
      const storageRef = ref(storageService, `/${user.uid}/${uuidv4()}`);
      const res = await uploadString(storageRef, selectImage, "data_url");
      downloadUrl = await getDownloadURL(res.ref);
    }

    // console.log(downloadUrl);
    if (nweet.length > 0) {
      const nweets = collection(dbService, "nweets");

      addDoc(nweets, {
        nweet,
        createAt: Date.now(),
        uid: user.uid,
        downloadUrl,
      });
      // getDB();
    }

    // setNweet("");
  };

  const onSelectImage = (e) => {
    // console.log(e);
    const {
      target: { files },
    } = e;
    const file = files[0];

    // console.log(file);

    const reader = new FileReader();

    reader.addEventListener("loadend", (finish) => {
      // console.log(finish.target.result);
      setSelectImage(finish.target.result);
    });

    reader.readAsDataURL(file);
  };

  const onClearImage = () => {
    setSelectImage("");
  };

  // const getDB = async () => {
  //   const db = await collection(dbService, "nweets");
  //   const docs = await getDocs(db);

  //   setNweets([]);

  //   docs.forEach((document) => {
  //     const newNweet = {
  //       ...document.data(),
  //       id: document.id,
  //     };

  //     setNweets((prev) => [...prev, newNweet]);
  //   });
  // };

  const setSnapshot = async () => {
    const db = await collection(dbService, "nweets");

    onSnapshot(db, (snapshot) => {
      // console.log("something happed.");
      // console.log(snapshot.docs);

      const newArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // console.log(newArray);
      setNweets(newArray);
    });
  };

  useEffect(() => {
    // getDB();
    setSnapshot();
  }, []);

  return (
    <>
      {user.photoURL ? <img src={user.photoURL} alt="profile" /> : null}
      <h3>
        user: {user.displayName === null ? "Undefined" : user.displayName}
      </h3>
      <form onSubmit={onSubmit}>
        {selectImage !== "" && (
          <div>
            <img src={selectImage} width="100px" alt="select" />
            <button onClick={onClearImage}>Clear</button>
          </div>
        )}
        <br />
        <input
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          value={nweet}
          onChange={onChange}
        />
        <input type="file" accept="image/*" onChange={onSelectImage} />
        <input type="submit" value="Nweet" />
      </form>
      <hr />
      {nweets.map((item) => (
        <Nweet key={item.id} isOwner={user.uid === item.uid} nweetObj={item} />
      ))}
    </>
  );
};
export default Home;
