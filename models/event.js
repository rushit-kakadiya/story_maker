import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
    event_name: { type: String, trim: true },
    event_url: { type: String, trim: true },
    visit: { type: Number },
    total_credit: { type: Number },
    used_credit: { type: Number },
    admin_name: { type: String, trim: true },
    admin_email: { type: String, trim: true, lowercase: true },
    admin_password: { type: String, trim: true },
    start_date: { type: Date, default: Date.now() },
    end_date: { type: Date, default: Date.now() },
    hashtag: { type: String, trim: true },
    theme_color: { type: String, trim: true },
    header: { type: String, trim: true },
    header_font_style: { type: Object },
    sub_header: { type: String, trim: true },
    sub_header_font_style: { type: Object },
    button_text: { type: String, trim: true },
    button_style: { type: String, trim: true },
    button_color: { type: String, trim: true },
    logo: { type: String, trim: true },
    background: { type: String, trim: true },
    photo_overview: { type: String, trim: true },
    photo_backgrounds: { type: Array },
    photo_stickers: { type: Array },
    require_name: { type: Boolean, default: false },
    require_email: { type: Boolean, default: false },
    require_gallery: { type: Boolean, default: false },
}, { versionKey: false, timestamps: true });

const Event = mongoose.models.Event || mongoose.model('Event', modelSchema);
export default Event;