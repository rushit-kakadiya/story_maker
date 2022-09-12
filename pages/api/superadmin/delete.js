import connectDB from '../../../middleware/mongodb';
import { commonQuery } from '../../../middleware/helper';
import Event from '../../../models/event';

connectDB();

const deleteFn = async (req, res) => {
    if (req.method === 'DELETE') {
        let check_data = await commonQuery(Event, "deleteOne", { _id: req.query.id });
        if (check_data.status != 1) {
            return res.status(400).json({ message: "Error, please try again." });
        }
        else {
            return res.status(200).json({ message: "Event deleted successfully." });
        }
    } else {
        return res.status(422).send({ message: 'req method not supported' });
    }
};

export default deleteFn;