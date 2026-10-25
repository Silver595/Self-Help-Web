import mongoose, { Schema } from 'mongoose';

const pdfSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        resource:{
            type:Schema.Types.ObjectId,
            ref:'Resource',
            required:true,
            unique:true
        },
        fileName:{
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        // Key for cloudflare storage, used to retrieve the file.
        key:{
            type: String,
            required: true,
        },
        size:{
            type: Number,
            required: true
        },
        isPublic:{
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
)

pdfSchema.index({user:1, createdAt: -1}); // Index for user and createdAt for faster queries
pdfSchema.index({resource:1, createdAt: -1}, {unique:true}); // Unique index for resource to ensure one PDF per resource

const Pdf = mongoose.model('Pdf', pdfSchema);