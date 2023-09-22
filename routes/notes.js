const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const Note = require("../models/Note");
const crypto = require("crypto");
const password = "200encrYptionSucCeSs200";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const algorithm = "aes-256-cbc";

//Encrypting text
function encrypt(text) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), data: encrypted.toString("hex") };
}

// Decrypting text
function decrypt(text) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.data, "hex");
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Testing the encryption
// let hw = "Shivam";
// hw = encrypt(hw);
// console.log(hw);
// console.log(decrypt(hw));

// Route 1: Get all the notes using GET "/api/notes/fetchallnotes". Login Required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    notes.forEach((note) => {
      note.title = decrypt(note.title);
      note.description = decrypt(note.description);
      note.tag = decrypt(note.tag);
    });
    res.json(notes);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error.");
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
    try {
      const titleR = req.body.title;
      const dscR = req.body.description;
      const tagR = req.body.tag;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let encryptedTitle = encrypt(titleR);
      let encryptedDescription = encrypt(dscR);
      let encryptedTag = encrypt(tagR);
      const note = new Note({
        user: req.user.id,
        tag: encryptedTag,
        title: encryptedTitle,
        description: encryptedDescription,
      });
      const savedNote = await note.save();
      decryptTitle = decrypt(savedNote.title);
      decryptDescription = decrypt(savedNote.description);
      decryptTag = decrypt(savedNote.tag);
      savedNote.title = decryptTitle;
      savedNote.description = decryptDescription;
      savedNote.tag = decryptTag;
      res.json(savedNote);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error.");
    }
  }
);

// Route 3: Update an existing note using PUT "/api/notes/updatenote". Login Required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) {
      newNote.title = encrypt(title);
    }
    if (description) {
      newNote.description = encrypt(description);
    }
    if (tag) {
      newNote.tag = encrypt(tag);
    }

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404).send("Not Found.");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send({ Error: "Not Allowed." });
    }
    updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    decryptTitle = decrypt(updatedNote.title);
    decryptDescription = decrypt(updatedNote.description);
    decryptTag = decrypt(updatedNote.tag);
    let user = updatedNote.user;
    let _id = updatedNote._id;
    let date = updatedNote.date;
    let __v = updatedNote.date;
    let decryptedNote = {
      user: user,
      tag: decryptTag,
      title: decryptTitle,
      description: decryptDescription,
      _id,
      date,
      __v,
    };
    res.json({ note: decryptedNote });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error.");
  }
});

// Route 4: Delete an existing note using PUT "/api/auth/updatenote". Login Required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404).send("Not Found.");
    }

    // Allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send({ Error: "Not Allowed." });
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
