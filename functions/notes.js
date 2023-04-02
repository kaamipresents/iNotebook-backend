const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//ROUTE TO CREATE A NEW POST
router.post(
  "/createnote",
  fetchuser,
  [
    // note has title
    body("title", "Title length should be minimum 3 characters").isLength({
      min: 3,
    }),
    // note has description
    body(
      "description",
      "Description length should be minimum 5 characters"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return res.status(400).json({ errors: errors.array()});

    }
    const { title, description, tag } = req.body;

    try {
      const note = await Note.create({
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
        user: req.user.id,
      });

      // console.log("User has created a new note");
    } catch (error) {
      return res.status(500).json("Internet Server Error");
    }
    res.send(JSON.stringify("Note created"));
  }
);

//ROUTE TO FETCH ALL THE NOTES
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  let success = false;
  try {
    const notes = await Note.find({ user: req.user.id });
    success = true;
    res.json({notes: notes, success:success});
    console.log("All notes of user has been fetched");
  } catch (error) {
    return res.status(500).json("Internet Server Error");
  }
});

//ROUTE TO UPDATE AN EXISTING NOTE
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  const newNote = {};

  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  try {
    const note = await Note.findById(req.params.id); //this is used to get http request element id
    //checking if the note exists
    if (!note) {
      return res.status(404).json("Note not found");
    }
    //checking breach
    if (note.user.toString() != req.user.id) {
      return res.status(401).json("Not Allowed");
    }

    let updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.send(updatedNote);
    console.log("Note has been updated successfully");
  } catch (error) {
    return res.status(500).json("Internet Server Error");
  }
});

//ROUTE TO DELETE AN EXISTING NOTE
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    const note = await Note.findById(req.params.id); //this is used to get http request element id
    //checking if the note exists
    if (!note) {
      return res.status(404).json("Note not found");
    }

    //checking breach
    if (note.user.toString() != req.user.id) {
      return res.status(401).json("Not Allowed");
    }

    await Note.findByIdAndDelete(req.params.id);
    console.log("Note has been deleted successfully");
    res.send("Note is deleted");
  } catch (error) {
    return res.status(500).json("Internet Server Error");
  }
});

module.exports = router;
