const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const Note = require("../models/Note");

// Route 1: Get all the notes using GET "/api/notes/fetchallnotes". Login Required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  let success = false;
  try {
    const notes = await Note.find({ user: req.user.id });
    success = true;
    res.json({success, notes});
  } catch (err) {
    console.log(err);
    res.status(500).json({success, error: `Internal server error\n ${err}`});
  }
});

// Route 2: Create a new note using POST "/api/notes/addnote". Login Required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 2 }),
    body("description", "Description must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
  let success = false;
    try {
      const { tag, title, description } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
      }
      const note = new Note({
        user: req.user.id,
        tag: tag,
        title: title,
        description: description,
      });
      const savedNote = await note.save();
      success = true;
      res.json({success, savedNote});
    } catch (err) {
      console.log(err);
      res.status(500).json({success, error: `Internal server error\n ${err}`});
    }
  }
);

// Route 3: Update an existing note using PUT "/api/notes/updatenote". Login Required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  let success = false;
  try {
    const { title, description, tag } = req.body;
    let newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404).json({success, error: "Not Found"});
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send({ success, error: "Not Allowed" });
    }
    updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    success = true;
    res.json({ success, note: updatedNote });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success, error: `Internal server error\n ${err}` });
  }
});

// Route 4: Delete an existing note using PUT "/api/auth/updatenote". Login Required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be deleted and delete it
    let success = false;
    let note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404).json({success, error: "Not Found"});
    }

    // Allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send({ success, error: "Not Allowed" });
    }
    note = await Note.findByIdAndDelete(req.params.id);
    success = true;
    res.json({ success , note: note });
  } catch (err) {
    success = false;
    console.log(err);
    res.status(500).json({ success, error: `Internal server error\n ${err}` });
  }
});

module.exports = router;
