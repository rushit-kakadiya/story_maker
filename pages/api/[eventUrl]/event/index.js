import { compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '../../../../middleware/mongodb';
import { commonQuery } from '../../../../middleware/helper';
import Event from '../../../../models/event';

connectDB();

const index = async (req, res) => {
    switch (req.method) {
        case "POST":
            await postIndex(req, res);
            break;
        default:
            res.status(422).send({ message: 'req method not supported' });
            break;
    }
}

const postIndex = async (req, res) => {
    const { email, password } = req.body;
    const check_data = await commonQuery(Event, "findOne", { email });
    if (check_data.status != 1) {
        return res.status(400).json({ message: "Invalid Email." });
    }
    else {
        const hash_password = compareSync(password, check_data.data.admin_password);
        if (!hash_password) {
            return res.status(400).json({ message: "invalid password." });
        } else {
            const token = jwt.sign({ token: password }, password, { expiresIn: '1d' });
            return res.status(200).json(check_data.data._id);
        }
    }
}

export default index;