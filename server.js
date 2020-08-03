const fs = require('fs');
const path = require('path');
const { notes } = require('./db/db.json');
const express = require('express');
const shortid = require('shortid');
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.static(__dirname + '/public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

function createNote(body, notesArray){
    const note = body;
    //console.log("our note is: ",note);
    //console.log("our saved notes are: ", notesArray);
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({notes: notesArray}, null, 2)
    );
    return note;
}

function findById(id, notesArray){
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
}

function removeNote(noteEl, notesArray){
    notesArray = notesArray.splice(notesArray.indexOf(noteEl), 1);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({notes: notesArray}, null, 2)
    );
    return notesArray;
}



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });

app.get('/api/notes', (req, res) => {
    return res.json(notes);
});

app.post('/api/notes', (req, res) => {
    req.body.id = shortid.generate();

    const note = createNote(req.body, notes);
    res.json(note);
});

app.delete('/api/notes/:id', (req, res) =>{
    const result = findById(req.params.id, notes);
    if(result){
        removeNote(result, notes);
        res.json(notes);
    }else{
        res.send(404);
    }
});
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });