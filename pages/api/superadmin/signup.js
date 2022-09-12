import connectDB from '../../../middleware/mongodb';
import { hashSync } from 'bcrypt';
import { commonQuery } from '../../../middleware/helper';
import Admin from '../../../models/admin';
connectDB()

const signup = async (req, res) => {
    if (req.method === 'POST') {
        const { name, email, password } = req.body;
        let check_data = await commonQuery(Admin, "findOne", { email });
        if (check_data.status != 1) {
            const hash_password = hashSync(password, 9);
            const create_admin = await commonQuery(Admin, "create", { name: name, email: email, password: hash_password });
            if (create_admin.status != 1) {
                return res.status(400).json({ message: "Error, Please try again." });
            } else {
                return res.status(200).json({ message: "Admin created successfully." });
            }
        }
        else {
            return res.status(400).json({ message: "Email already exist." });
        }
    } else {
        return res.status(422).send({ message: 'req method not supported' });
    }
};


export default signup;