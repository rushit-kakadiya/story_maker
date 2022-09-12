import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    password: { type: String, trim: true },
}, { versionKey: false, timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', modelSchema);
export default Admin;