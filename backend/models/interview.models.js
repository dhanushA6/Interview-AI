import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const MessageSchema = new Schema({
  role: { type: String, enum: ['user', 'ai'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const InterviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  experienceYears: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  messages: [MessageSchema],
  finished: { type: Boolean, default: false },
  feedback: String,
  points: { type: Number, min: 0, max: 10 },
  resume: { type: Schema.Types.ObjectId, ref: 'Resume', required: false }, // Optional resume reference
});

const Interview = model('Interview', InterviewSchema);
export default Interview;
