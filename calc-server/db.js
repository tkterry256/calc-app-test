import mongoose from 'mongoose';

import Operation from './models/operation.js';

import logger from './logger.js';

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const db = mongoose.connection;

db.once('open', () => {
  logger.info('Connected to MongoDB');
});

db.on('error', (err) => {
  logger.error('MongoDB connection error', err);
});

export function insertOperation(firstNumber, secondNumber, operator, result) {
  const operation = new Operation({
    firstNumber,
    secondNumber,
    operator,
    result,
    date: Date.now(),
  });
  return operation.save();
}

export function getOperations(limit = -1, order = -1) {
  let query = Operation.find().sort({ date: order });

  if (limit > 0) {
    query = query.limit(limit);
  }

  return query.exec();
}
