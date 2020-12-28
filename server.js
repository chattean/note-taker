// setting up express
const express = require('express');
const fs = require('fs');
// Import the 'path' module
const path = require('path');

const app = express();

// Importing the Database
const notes = require('./db/db.json') || [];


//to get a unique ID so that the id may never be reused
const { v4: uuidV4 } = require('uuid');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'))

// Function to add a new note
function createNewNote(note, notesArray) {
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify(notesArray, null, 2)
  );
  return note;
}

// Function to delete a Note
function deleteNote(noteID, notesArray){
  const arrayAfterDel = notesArray.filter(data => data.id != noteID);
  return arrayAfterDel;
}

// Return all notes when going to notes page
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// whenever the page has a POST then this entry is saved
app.post('/api/notes', (req, res) => {
    // set id based on what the next index of the array will be
  req.body.id = uuidV4();
  const note = createNewNote(req.body, notes);
  res.json(note);
});

//********** BONUS *****************//
// Deletes the note: cant figure out how to refresh the page after the delete. 
// but when user refreshes the page they see the note deleted. 

app.delete('/api/notes/:id', (req, res) => {
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify(deleteNote(req.params.id, notes), null, 2)
  );
  res.json(notes);
});
// Update the notes route to go to notes.html
app.get('/notes',(req,res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Update the * route to return index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});
// Start the server on the port
app.listen(process.env.PORT || 3000);