import { dbService, storageService } from "fbInstance";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [newNweet, setNewNweet] = useState(nweetObj.nweet);
  const [isEdit, setIsEdit] = useState(false);

  const onDeleteNweet = async (e) => {
    const isDelete = window.confirm("delete this nweet?");

    if (isDelete) {
      const nweetRef = await getNweet(nweetObj.id);
      await deleteDoc(nweetRef);
      if (nweetObj.downloadUrl !== "") {
        const imageRef = ref(storageService, nweetObj.downloadUrl);
        await deleteObject(imageRef);
      }
    }
  };

  const onUpdateNweet = (e) => {
    setIsEdit((prev) => !prev);
    if (isEdit) {
      // console.log('from: ', nweetObj.nweet, 'to: ', newNweet);
      const isUpdate = window.confirm("update this nweet?");

      if (isUpdate) {
        updateDB(nweetObj.id, { nweet: newNweet });
      }
    }
  };

  const onChange = (e) => {
    setNewNweet((prev) => (prev = e.target.value));
  };

  const getNweet = async (nweetId) => {
    const docRef = doc(dbService, `/nweets/${nweetId}`);
    return docRef;
  };

  const updateDB = async (nweetId, newData) => {
    const docRef = doc(dbService, `/nweets/${nweetId}`);
    updateDoc(docRef, newData);
  };

  return (
    <>
      {nweetObj.downloadUrl && (
        <img src={nweetObj.downloadUrl} width="100px" alt="img" />
      )}
      <h4>
        {isEdit ? (
          <input value={newNweet} onChange={onChange}></input>
        ) : (
          nweetObj.nweet
        )}
      </h4>
      {isOwner && (
        <>
          <button onClick={onDeleteNweet}>Delete</button>
          <button onClick={onUpdateNweet}>{isEdit ? "Update" : "Edit"}</button>
        </>
      )}
      <hr></hr>
    </>
  );
};

export default Nweet;
