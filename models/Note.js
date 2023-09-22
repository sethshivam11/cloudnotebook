const mongoose = require("mongoose");
const { Schema } = require('mongoose');
const NoteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  tag: {
    type: Object,
    default: "General",
    required: true
  },
  title: {
    type: Object,
    required: true,
  },
  description: {
    type: Object,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
});
module.exports = mongoose.model("notes", NoteSchema);
