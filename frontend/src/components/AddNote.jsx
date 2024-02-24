import React, { useContext, useState } from "react";
import noteContext from "../context/noteContext";

const AddNote = (props) => {
  const context = useContext(noteContext);
  const [note, setNote] = useState({tag: "General", title: "", description: ""});
  const { addNote } = context;
  const handleSubmit = (e) => {
    e.preventDefault();
    addNote(note.tag, note.title, note.description);
    setNote({tag: "General", title: "", description: ""});
    props.showAlert("Note Added Successfully.", "success");
  }
  const onChange = (e) => {
    setNote({...note, [e.target.name]: e.target.value});
  }
  const handleClear = () => {
    setNote({ tag: "General", title: "", description: "" });
    props.showAlert("Cleared Successfully.", "success");
  } 
  return (
    <div>
      <div className="container my-4">
        <h1>Add a Note</h1>

        <form className="my-3">
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">
              Tag
            </label>
            <input
              type="text"
              className="form-control"
              id="tag"
              name="tag"
              onChange={onChange}
              value={note.tag}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              aria-describedby="emailHelp"
              onChange={onChange}
              minLength={5}
              value={note.title}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              onChange={onChange}
              minLength={5}
              value={note.description}
              required
            />
          </div>
          <button
            disabled={
              note.title.length < 5 ||
              note.description.length < 5 ||
              note.tag.length < 1
            }
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Add Note
          </button>
          <button
            disabled={note.title.length < 1 || note.description.length < 1}
            type="submit"
            className="btn btn-warning mx-2"
            onClick={handleClear}
          >
            Clear
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
