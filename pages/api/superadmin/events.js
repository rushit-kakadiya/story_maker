import connectDB from '../../../middleware/mongodb';
import Event from '../../../models/event';

connectDB();

const events = async (req, res) => {
    if (req.method === 'GET') {
        if (req.query.overview) {
            let top_event = await Event.find({}).sort({ "used_credit": -1 }).limit(10)
            if (!top_event) {
                return res.status(400).json({ message: "No data found" });
            }
            return res.status(200).json(top_event);
        }

        const perPage = Number.parseInt(req.query.perPage)
        const page = Number.parseInt(req.query.page)
        let getData;
        if (perPage && page) {
            if (req.query.eventType === "active") {
                getData = await Event.find({ 'end_date': { $gt: new Date() } }).limit(perPage).skip(perPage * (page - 1)).select("event_name visit total_credit used_credit admin_name admin_password admin_email event_url start_date end_date")
            } else if (req.query.eventType === "ended") {
                getData = await Event.find({ 'end_date': { $lte: new Date() } }).limit(perPage).skip(perPage * (page - 1)).select("event_name visit total_credit used_credit admin_name admin_password admin_email event_url start_date end_date")
            } else {
                getData = await Event.find().limit(perPage).skip(perPage * (page - 1)).select("event_name visit total_credit used_credit admin_name admin_password admin_email event_url start_date end_date")
            }
        } else {
            getData = await Event.find().select("event_name visit total_credit used_credit admin_name admin_password admin_email event_url start_date end_date")
        }

        const count = await Event.find().count();
        const activeCount = await Event.find({ 'end_date': { $gte: new Date() } }).count();
        const endedCount = await Event.find({ 'end_date': { $lt: new Date() } }).count();
        
        if (getData) {
            return res.status(200).json({ count, activeCount, endedCount, getData });
        } else {
            return res.status(400).json({ message: "No data found" });
        }
    } else {
        return res.status(422).send({ message: 'req method not supported' });
    }
};

export default events;

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "50mb"
        },
    },
};