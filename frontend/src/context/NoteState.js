import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "https://cloudnotebook-zp4a.onrender.com";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);
  const accountInitial = [];
  const [account, setAccount] = useState(accountInitial);

  // Get Account Credentials
  const getAccount = async () => {
    const response = await fetch(`${host}/api/auth/credentials`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const jsonData = await response.json();
    setAccount(jsonData.user);
  };

  // Update Account Credentials
  const updateAccount = async (credentials) => {
    try {
      const response = await fetch(`${host}/api/auth/credentials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(credentials),
      });
      const jsonData = await response.json();
      setAccount(jsonData.user);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  // Get all Notes
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    if(json.success){
      setNotes(json.notes);
    }else{
      return false;
    }
  };

  // Add a Note
  const addNote = async (tag, title, description) => {
    // API Call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ tag, title, description }),
    });
    const note = await response.json();
    if(note.success) {
      console.log(note);
      setNotes(notes.concat(note.savedNote));
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    // API Call
    // eslint-disable-next-line
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const jsonData = await response.json();
    if(jsonData.success){
      let newNotes = notes.filter((note) => {
        return note._id !== id;
      });
      setNotes(newNotes);
    }
  };

  // Edit a Note
  const editNote = async ({ id, tag, title, description }) => {
    // API Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    // eslint-disable-next-line
    const json = await response.json();
    if(json.success){
    let newNotes = JSON.parse(JSON.stringify(notes));
    for (let i = 0; i < newNotes.length; i++) {
      const element = newNotes[i];
      if (element._id === id) {
        newNotes[i].title = title;
        newNotes[i].description = description;
        newNotes[i].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  }
  };

  return (
    <NoteContext.Provider
      value={{
        account,
        notes,
        getAccount,
        updateAccount,
        addNote,
        deleteNote,
        editNote,
        getNotes,
      }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
