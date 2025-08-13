import mongoose, { Schema, models, model } from 'mongoose';



export interface ITweetTask extends Document {
  wallet: string; // user wallet address
  tweetId: string;
  tweetUrl: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  createdAt: Date;
}


const TweetTaskSchema = new Schema<ITweetTask>({
  wallet: { type: String, required: true },
  tweetId: { type: String, required: true },
  tweetUrl: { type: String, required: true },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default models.TweetTask || model<ITweetTask>('TweetTask', TweetTaskSchema);
