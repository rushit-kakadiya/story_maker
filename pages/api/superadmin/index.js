import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '../../../middleware/mongodb';
import { commonQuery } from '../../../middleware/helper';
import Admin from '../../../models/admin';

connectDB();

const index = async (req, res) => {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        const check_data = await commonQuery(Admin, "findOne", { email });
        if (check_data.status != 1) {
            return res.status(400).json({ message: "Invalid Email." });
        }
        else {
            const hash_password = bcrypt.compareSync(password, check_data.data.password);
            if (!hash_password) {
                return res.status(400).json({ message: "invalid password." });
            } else {
                const token = jwt.sign({ token: password }, password, { expiresIn: '1d' });
                return res.status(200).json(token);
            }
        }
    } else {
        return res.status(422).send({ message: 'req method not supported' });
    }
};

export default index;