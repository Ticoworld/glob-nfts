import mongoose, { Schema, models, model } from 'mongoose';

export interface IInviteCode extends Document {
  code: string;
  used: boolean;
  usedBy?: string; // User wallet address
  inviter?: string; // User wallet address
  createdAt: Date;
  expiresAt?: Date;
}


const InviteCodeSchema = new Schema<IInviteCode>({
  code: { type: String, required: true, unique: true },
  used: { type: Boolean, default: false },
  usedBy: { type: String },
  inviter: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

// Virtual status field for UI
InviteCodeSchema.virtual('status').get(function () {
  const now = new Date();
  if (this.used) return 'Used';
  if (this.expiresAt && this.expiresAt < now) return 'Expired';
  return 'Active';
});

export default models.InviteCode || model<IInviteCode>('InviteCode', InviteCodeSchema);
