import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true }, // it generate [SHA-256] Hash token for Current Referesh token
    userAgent: { type: String, default: 'unknown' },
    ip: { type: String, default: 'unknown' },
    lastUsedAt: { type: Date, default: Date.now },
    expiresAt: {type: Date, required: true},
  },
  {timestamps: true},
)

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // on  {mongodb} it deletes automatically. bro If you want to make something related to times then increse it

export const Session = mongoose.model('Session', sessionSchema)
