const express = require('express');

const app = express();
app.use(express.json());

app.get('/courses', (request, response) => {
  const query = request.query;
  console.log(query);
  return response.json(["course 1", "course 2", "course 3"]);
});

app.post('/courses', (request, response) => {
  const body = request.body;
  console.log(body);
  return response.json(["course 1", "course 2", "course 3", "course 4"]);
});

app.put('/course/:id', (request, response) => {
  return response.json(["course 5", "course 2", "course 3", "course 4"]);
});

app.patch('/course/:id', (request, response) => {
  return response.json(["course 5", "course 6", "course 3", "course 4"]);
});

app.delete('/course/:id', (request, response) => {
  return response.json(["course 5", "course 6", "course 3"]);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));