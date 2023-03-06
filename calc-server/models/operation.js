import mongoose, { SchemaType } from 'mongoose';
const { Enum } = SchemaType;
const operationSchema = new mongoose.Schema({
  firstNumber: {
    type: Number,
    required: true,
  },

  secondNumber: {
    type: Number,
    required: true,
  },
  operator: {
    type: String,
    required: true,
    trim: true,
  },
  result: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});
export default mongoose.model('Operation', operationSchema);
