import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
    // event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    event_url: { type: String, trim: true },
    file_name: { type: String, trim: true },
    file_size: { type: Number },
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    image: { type: String, trim: true },
}, { versionKey: false, timestamps: true });

const Entries = mongoose.models.Entries || mongoose.model('Entries', modelSchema);
export default Entries;