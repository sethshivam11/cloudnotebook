import React, { useState, useContext, useEffect, useRef } from "react";
import noteContext from "../context/noteContext";
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";

const Notes = (props) => {
  let navigate = useNavigate();
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;
  useEffect(() => {
    if(localStorage.getItem('token')){
      let validToken = getNotes();
      if(!validToken){
        navigate("/login");
      }
    }
      else{
      props.showAlert("Please Login or Signup", "warning");
      navigate('/login');
    }
    // eslint-disable-next-line
  }, []);
  const ref = useRef(null);
  const refClose = useRef(null);
  const [note, setNote] = useState({ id: "", etag: "General", etitle: "", edescription: "" });
  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({id: currentNote._id, etag: currentNote.tag, etitle: currentNote.title, edescription: currentNote.description});
  };
  const handleUpdate = () => {
    editNote({
      id: note.id,
      tag: note.etag,
      title: note.etitle,
      description: note.edescription,
    });
    refClose.current.click();
    props.showAlert("Note Updated Successfully.", "success");
  };
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };
  
  return (
    <div>
      <AddNote showAlert={props.showAlert} />
      {/* eslint-disable-next-line */}
      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      />
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-etitle fs-5" id="exampleModalLabel">
                Edit Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etag"
                    name="etag"
                    onChange={onChange}
                    value={note.etag}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    aria-describedby="emailHelp"
                    value={note.etitle}
                    onChange={onChange}
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    onChange={onChange}
                    value={note.edescription}
                    minLength={5}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={refClose}
              >
                Close
              </button>
              <button
                disabled={
                  note.etitle.length < 5 ||
                  note.edescription.length < 5 ||
                  note.etag.length < 1
                }
                onClick={handleUpdate}
                type="button"
                className="btn btn-primary"
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <h2 className="my-3">Your Notes</h2>
        <p>
          {notes.length === 0 && "No Notes to display here. Create One Now."}
        </p>
        <div className="d-grid float-start"
        id="gridContainer"
        style={{alignItems: "center",
                justifyContent: "space-evenly",
                flexWrap: "wrap",
        }}>
          {notes.length > 0 &&
          notes.map((note) => {
            return (
              <NoteItem
                note={note}
                key={note._id}
                updateNote={updateNote}
                showAlert={props.showAlert}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Notes;
