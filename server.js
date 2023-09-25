const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const notes = require("./db/db.json");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/notes", (req, res) => {
  // Serve the notes.html file
  const notesPath = path.join(__dirname, "./public/notes.html");
  // Send the notes.html file as the response
  res.sendFile(notesPath);
});

app.get("/", (req, res) => {
  // Serve the index.html file
  const indexPath = path.join(__dirname, "./public/index.html");
  res.sendFile(indexPath);
});

app.get("/api/notes", (req, res) => {
  // Read the db.json file and return saved notes as JSON
  // Use the fs module to read the db.json file
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Parse the JSON data and send it as the response

    res.json(notes);
  });
});

// Define the generateUniqueID function before using it
function generateUniqueID() {
  // Generate a random 8-character alphanumeric ID
  return Math.random().toString(36).substring(2, 10);
}

app.post("/api/notes", (req, res) => {
  // Receive a new note to save, add it to the db.json file, and return the new note
  const newNote = req.body; // Assuming the new note data is in the request body
  // Use the fs module to read the existing notes from db.json
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Parse the existing notes and add the new note
    // const notes = JSON.parse(data);
    newNote.id = generateUniqueID(); // Generate a unique ID for the new note
    notes.push(newNote);

    // Write the updated notes back to db.json
    fs.writeFile("db/db.json", JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Send the new note as the response
      res.json(newNote);
    });
  });
});

app.listen(PORT, () =>
  console.log(`Server is listening on port http://localhost:${PORT}`)
);
