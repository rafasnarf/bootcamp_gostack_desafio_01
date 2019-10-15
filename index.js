const express = require('express');
const server = express();
server.use(express.json());

const projects = [{
  id: '1',
  title: 'Novo Projeto',
  tasks: []
}];

let numberRequests = 0

//Middleware to count the Requests made to the server
function requests(req, res, next) {
  numberRequests++;
  console.log(`Number of Requests: ${numberRequests}`);
  next();
}

//Middleware for verify if ID exists
function checkIdExist(req, res, next) {
  const { id } = req.params;
  const index = projects.find(p => p.id == id);
  if (!index) {
    return res.status(400).json({ error: "User does not exist" });
  }
  return next();
};

//List all projects
server.get('/projects', requests, (req, res) => {
  return res.json(projects);
});

//Add a new project
server.post('/projects', requests, (req, res) => {
  const { id, title } = req.body;
  projects.push({ "id": id, "title": title, "tasks": [] });
  return res.json(projects);
});

//Add a new taks into a project
server.post('/projects/:id/tasks', requests, checkIdExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);
  project.tasks.push(title);
  return res.json(projects);
});

//Alter a project
server.put("/projects/:id", requests, checkIdExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);
  project.title = title;
  return res.json(projects);
});

//Delete a project
server.delete("/projects/:id", requests, checkIdExist, (req, res) => {
  const { id } = req.params;
  const index = projects.find(p => p.id == id);
  projects.splice(index, 1);
  return res.send();
});


server.listen(3000);