const express = require('express');
const cors = require('cors');

const { v4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((element) => element.username === username )

  if(!user) {
    return response.status(400).json({error: 'Mensagem do erro'});
  }

  request.user = user

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username} = request.body;

  if(!username) {
    return response.status(400).json({erro: 'Lacking information at the body\'s request property username.'})
  }

  const createdInformation = {
    id:v4,
    name: name,
    username: username,
    todos: []
  }

  users.push(createdInformation);

  return response.status(201).json(createdInformation);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title } = request.body;
  const { deadline } = request.body;

  // const dateFormat = Date(deadline + " 00:00");

  const inforTodos = {
    id: v4,
    title: title,
    done:false,
    deadline: new Date(deadline),
    created_at: new Date() // I'm not sure about this line.
  }

  user.todos.push(inforTodos)

  response.status(201).json(inforTodos)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { title } = request.body;
  const { deadline } = request.body;
  const { id } = request.params;

  const positionUser = users.findIndex((element) => element.username === username);

  if(!positionUser){
    return response.status(200).json({erro: 'UserName wasn\'t found.'})
  }

  const userKey = users[users].todos.findIndex((element) => element.id === id);

  users[positionUser].todos[userKey].title = title;
  user[userKey].todos[userKey].deadline = deadline;

  response.status(200).json(user.todos[userKey]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { usernome } = request.headers;
  const { id } = request.params;

  const positionUser = users.findIndex((element) => element.username === usernome);
  const userKey = users[positionUser].todos.findIndex((element) => element.id === id);

  if(!userKey) {
    return response.status(200).json({erro: 'Any user wasn\'t found'});
  }

  users[positionUser].todos[userKey].done = true;
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  const positionUser = users.findIndex((element) => element.username == username);
  
  if(!positionUser) {
    return response.status(200).json({erro: 'UserName wasn\'t found'});
  }

  const userKey = users[positionUser].todos.findIndex((element) => element.id === id);

  if(!userKey){
    return response.status(200).json({erro: 'Does not found the to do'})
  }

  const userErased = users[positionUser].todos.find((element) => element.id === id)

  users[positionUser].todos.splice(userKey, 1)

  response.status(202).json(userErased)
});

module.exports = app;











