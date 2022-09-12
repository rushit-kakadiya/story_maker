import nextConnect from 'next-connect';
import connectDB from '../../../../middleware/mongodb';
import { commonQuery } from '../../../../middleware/helper';
import Event from '../../../../models/event';

connectDB();

const getEventGallery = async (req, res) => {
    let check_data = await commonQuery(Event, 'findOne', { event_url: req.query.eventUrl }, {}, "require_gallery event_url")
    if (check_data.status != 1) {
        return res.status(400).json({ message: "Invalid Event." });
    }
    return res.status(200).json(check_data.data);
}

const postEventGallery = async (req, res) => {
    const update_data = await commonQuery(Event, "findOneAndUpdate", { event_url: req.query.eventUrl }, { require_gallery: req.body.galleryChecked });
    if (update_data.status != 1) {
        return res.status(400).json({ message: "Error, Please try again." });
    } else {
        return res.status(200).json({ message: "Gallery permission updated." });
    }
}

const gallery = async (req, res) => {
    switch (req.method) {
        case "GET":
            await getEventGallery(req, res);
            break;
        case "POST":
            await postEventGallery(req, res);
            break;
        default:
            res.status(422).send({ message: 'req method not supported' });
            break;
    }
};

export default gallery;