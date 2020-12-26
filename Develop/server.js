// setting up express
const express = require('express');
const fs = require('fs');
// Import the 'path' module
const path = require('path');

const app = express();

const notes = require('./db/db.json') || [];

const { v4: uuidV4 } = require('uuid');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'))

function createNewNote(note, notesArray) {
  // const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify(notesArray, null, 2)
  );
  return note;
}

app.get('/api/notes', (req, res) => {
  // set id based on what the next index of the array will be
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
    // set id based on what the next index of the array will be
  req.body.id = uuidV4();
  const note = createNewNote(req.body, notes);
  res.json(note);
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
const PORT = 3001;
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));


