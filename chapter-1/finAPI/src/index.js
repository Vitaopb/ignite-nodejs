const { request } = require('express');
const express = require('express');
const app = express();

app.use(express.json());

const { v4: uuid } = require('uuid');


const costumers = [];

function verifyExistsAccountCPF(req, res, next) {
  const { cpf } = req.params
  const costumer = costumers.find(costumer => costumer.cpf === cpf);

  if (!costumer) {
    return res.status(400).json({ error: 'Account not exists' });
  }

  request.costumer = costumer;
  return next();
}

function getBalance(statement) {
  const balance = statement.reduce((acc, opration) => {
    if(opration.type === 'credit') {
      return acc + opration.value;
    } else {
      return acc - opration.value;
    }
  });
  return balance;
}


app.post('/account', (request, response) => {
  const { name, cpf } = request.body;
  if(!name || !cpf) {
    return response.status(400).json({ error: 'Missing data' });
  }

  const costumer = costumers.find(costumer => costumer.cpf === cpf);
  if(costumer) {
    return response.status(400).json({ error: 'Account already exists' });
  }

    costumers.push({
      id: uuid(),
      cpf,
      name,
      statement: []
    });
    return response.status(201).json({ message: 'Account created' });
});

app.get("/statement/:cpf", verifyExistsAccountCPF, (request, response) => {
  const { costumer } = request;	
  return response.json(costumer.statement);

});

app.post("/deposit/:cpf", verifyExistsAccountCPF, (request, response) => {
  const { description, amount } = request.body;
  const { costumer } = request;

  const statementOperation = {
    description,
    amount,
    date: new Date(),
    type: 'credit'
  }
  costumer.statement.push(statementOperation);

  return response.json(statementOperation);
});

app.post("/withdraw/:cpf", verifyExistsAccountCPF, (request, response) => {
  const { amount } = request.body;
  const { costumer } = request;

  const balance = getBalance(costumer.statement);

  if(balance < amount) {
    return response.status(400).json({ error: 'Insufficient funds' });
  }

  const statementOperation = {
    amount,
    date: new Date(),
    type: 'debit'
  }

  costumer.statement.push(statementOperation);
  return response.status(200).json({statementOperation});
});

app.listen(3000, () => console.log('Listening on port 3000'));