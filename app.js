const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

const dataFile = "members.json";

// Endpoint: Get all members
app.get("/members", (req, res) => {
  const members = JSON.parse(fs.readFileSync(dataFile));
  res.json(members);
});

// Endpoint: Get a member by ID
app.get("/members/:id", (req, res) => {
  const members = JSON.parse(fs.readFileSync(dataFile));
  const member = members.find((m) => m.id === parseInt(req.params.id));
  if (member) {
    res.json(member);
  } else {
    res.status(404).send("Member not found");
  }
});

// Endpoint: Add a new member
app.post("/members", (req, res) => {
  const members = JSON.parse(fs.readFileSync(dataFile));
  const newMember = req.body;
  newMember.id = Math.max(...members.map((m) => m.id)) + 1;
  members.push(newMember);
  fs.writeFileSync(dataFile, JSON.stringify(members, null, 2));
  res.status(201).json(newMember);
});

// Endpoint: Update a member by ID
app.put("/members/:id", (req, res) => {
  const members = JSON.parse(fs.readFileSync(dataFile));
  const memberIndex = members.findIndex((m) => m.id === parseInt(req.params.id));
  if (memberIndex !== -1) {
    const updatedMember = req.body;
    updatedMember.id = parseInt(req.params.id);
    members[memberIndex] = updatedMember;
    fs.writeFileSync(dataFile, JSON.stringify(members, null, 2));
    res.json(updatedMember);
  } else {
    res.status(404).send("Member not found");
  }
});

// Endpoint: Delete a member by ID
app.delete("/members/:id", (req, res) => {
  const members = JSON.parse(fs.readFileSync(dataFile));
  const memberIndex = members.findIndex((m) => m.id === parseInt(req.params.id));
  if (memberIndex !== -1) {
    members.splice(memberIndex, 1);
    fs.writeFileSync(dataFile, JSON.stringify(members, null, 2));
    res.status(204).send();
  } else {
    res.status(404).send("Member not found");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
