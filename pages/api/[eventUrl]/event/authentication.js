import connectDB from '../../../../middleware/mongodb';
import { commonQuery } from '../../../../middleware/helper';
import Event from '../../../../models/event';

connectDB();

const getEventAuth = async (req, res) => {
    let check_data = await commonQuery(Event, 'findOne', { event_url: req.query.eventUrl }, {}, "require_name require_email event_url")
    if (check_data.status != 1) {
        return res.status(400).json({ message: "Invalid Event." });
    }
    return res.status(200).json(check_data.data);
}

const postEventAuth = async (req, res) => {
    const { requireName, requireEmail } = req.body;
    const update_data = await commonQuery(Event, "findOneAndUpdate", { event_url: req.query.eventUrl }, { require_name: requireName, require_email: requireEmail });
    if (update_data.status != 1) {
        return res.status(400).json({ message: "Error, Please try again." });
    } else {
        return res.status(200).json({ message: "Authentication Saved." });
    }
}
const authentication = async (req, res) => {
    switch (req.method) {
        case "GET":
            await getEventAuth(req, res);
            break;
        case "POST":
            await postEventAuth(req, res);
            break;
        default:
            res.status(422).send({ message: 'req method not supported' });
            break;
    }
};

export default authentication;