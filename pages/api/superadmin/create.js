import { hashSync } from 'bcrypt';
import connectDB from '../../../middleware/mongodb';
import { commonQuery } from '../../../middleware/helper';
import Event from '../../../models/event';

connectDB();

const create = async (req, res) => {
    if (req.method === 'POST') {
        let check_data = await commonQuery(Event, "findOne", { event_url: req.body.event_url });
        if (check_data.status != 1) {
            const hash_password = hashSync(req.body.admin_password, 9);
            const create_admin = await commonQuery(Event, "create", {
                visit: req.body.visit,
                used_credit: req.body.used_credit,
                total_credit: req.body.total_credit,
                event_name: req.body.event_name,
                admin_name: req.body.admin_name,
                admin_email: req.body.admin_email,
                admin_password: hash_password,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                event_url: req.body.event_url
            });
            if (create_admin.status != 1) {
                return res.status(400).json({ message: "Error, Please try again." });
            } else {
                return res.status(200).json({ message: "Event created successfully." });
            }
        }
        else {
            return res.status(400).json({ message: "Event already exist." });
        }
    } else {
        return res.status(422).send({ message: 'req method not supported' });
    }
};


export default create;