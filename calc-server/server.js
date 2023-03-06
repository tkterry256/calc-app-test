import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import { operations } from './app/calc.js';
import { insertOperation, getOperations } from './db.js';

import logger from './logger.js';
import httpLogger from './httpLogger.js';

const app = express();

const staticServe = express.static('public');

app.use(httpLogger);
app.use(staticServe);
app.use(express.json());
app.use(cors());

app.post('/calculate', async (req, res) => {
  const { firstNumber, secondNumber, operator } = req.body;
  const operation = operations[operator];
  const result = operation(firstNumber, secondNumber);
  const newOperation = await insertOperation(
    firstNumber,
    secondNumber,
    operator,
    result
  );
  res.json(newOperation);
});

app.get('/history/:count', async (req, res) => {
  const { count } = req.params;
  const history = await getOperations(count, 1);
  res.json(history);
});

app.get('*', (_, res) => {
  res.redirect('/');
});

app.use(logErrors);
app.use(errorHandler);

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}
function errorHandler(err, req, res, next) {
  res.status(500).send('Error!');
}

const { PORT } = process.env;
app.listen(PORT, () => {
  logger.info(`Calc server listening on port ${PORT}`);
});
