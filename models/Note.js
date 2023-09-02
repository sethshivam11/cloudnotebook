const mongoose = require("mongoose");
const { Schema } = require('mongoose');
const NoteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  tag: {
    type: String,
    default: "General",
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
});
module.exports = mongoose.model("notes", NoteSchema);
