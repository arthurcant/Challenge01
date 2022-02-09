const express = require('express');
const cors = require('cors');

const { v4:uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((element) => element.username === username )

  if(!user) {
    return response.status(404).json({error: 'Mensagem do erro'});
  }

  request.user = user

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username} = request.body;

  const verifyingUsername = users.some((element) => element.username == username); 

  if(verifyingUsername) {
    return response.status(400).json({erro: 'The username already exist.'})
  }

  const createdInformation = {
    id:uuidv4(),
    name,
    username,
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
  const { title, deadline } = request.body;
  const { user } = request;

  // const dateFormat = Date(deadline + " 00:00");

  const inforTodos = {
    id: uuidv4(),
    title,
    done:false,
    deadline: new Date(deadline),
    created_at: new Date() // I'm not sure about this line.
  }

  user.todos.push(inforTodos)

  response.status(201).json(inforTodos)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { title, deadline} = request.body;
  const { id } = request.params;
  
  if(!username === -1){
    return response.status(404).json({error: 'Mensagem do erro'})
  }

  const positionUser = users.findIndex((element) => element.username === username);


  const userKey = users[positionUser].todos.findIndex((element) => element.id === id);

  if(userKey === -1){
    return response.status(404).json({error: 'Mensagem do erro'})   
  }

  const todoDate = new Date(deadline).toISOString()

  users[positionUser].todos[userKey].title = title;
  users[positionUser].todos[userKey].deadline = todoDate;

  response.status(200).json(users[positionUser].todos[userKey]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { usernome } = request.headers;
  const { done, name, username } = request.body;
  const { id } = request.params;
  
  if(!username) {
    return response.status(404).json({error: 'Mensagem do erro'});
  }

  const positionUser = users.findIndex((element) => element.username === usernome);
  const userKey = users[positionUser].todos.findIndex((element) => element.id === id);

  if(positionUser > -1) {
    if(!(userKey > -1))
    return response.status(404).json({error: 'Mensagem do erro'});
  }
  
  if(done == false){
    done = true;
    users[positionUser].todos[userKey].done = done;
  }
  
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  
  if(!username) {
    return response.status(404).json({error: 'Mensagem do erro'})
  }
  
  const positionUser = users.findIndex((element) => element.username == username);
  const userKey = users[positionUser].todos.findIndex((element) => element.id === id);

  if(userKey == -1){
    return response.status(404).json({error: 'Mensagem do erro'})
  }

  const userErased = users[positionUser].todos.find((element) => element.id === id)

  users[positionUser].todos.splice(userKey, 1)

  response.status(204).json(userErased)
});

module.exports = app;



