import React, { useContext } from 'react'
import noteContext from '../context/noteContext';

const NoteItem = (props) => {
const context = useContext(noteContext);
const { deleteNote } = context;
const { note, updateNote } = props;
  return (
    <div>
      <div className="card my-1" id="noteCard">
        <div className="card-header">{note.tag}</div>
        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text">{note.description}</p>
          <button href="" rel="no-referrer" className="btn btn-success mx-2" onClick={() => updateNote(note)}>
            <i className="fa fa-pencil-square-o"></i> Edit
          </button>
          <button
            href=""
            rel="no-referrer"
            className="btn btn-danger mx-2"
            onClick={() => (deleteNote(note._id) && props.showAlert("Note Deleted Successfully.", "success"))}
          >
            <i className="fa fa-trash-o"></i> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteItem
