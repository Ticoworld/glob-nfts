import mongoose, { Schema, models, model } from 'mongoose';



export interface IUser extends Document {
  wallet: string;
  twitter?: string;
  twitterId?: string;
  twitterAccessToken?: string;
  twitterAvatar?: string;
  discord?: string;
  points: number;
  invites: string[]; // Array of invite code IDs
  twitterConnectedPointAwarded?: boolean;
  createdAt: Date;
}


const UserSchema = new Schema<IUser>({
  wallet: { type: String, required: true, unique: true },
  twitter: { type: String },
  twitterId: { type: String },
  twitterAccessToken: { type: String },
  twitterAvatar: { type: String },
  discord: { type: String },
  points: { type: Number, default: 0 },
  invites: [{ type: Schema.Types.ObjectId, ref: 'InviteCode' }],
  twitterConnectedPointAwarded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default models.User || model<IUser>('User', UserSchema);
