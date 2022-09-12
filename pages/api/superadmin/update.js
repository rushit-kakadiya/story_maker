import bcrypt from "bcrypt";
import connectDB from "../../../middleware/mongodb";
import { commonQuery } from "../../../middleware/helper";
import Event from "../../../models/event";

connectDB();
const update = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getIndex(req, res);
      break;
    case "POST":
      await postIndex(req, res);
      break;
    default:
      res.status(422).send({ message: "req method not supported" });
      break;
  }
};

const getIndex = async (req, res) => {
  const check_data = await commonQuery(Event, "findOne", { _id: req.body.id });
  if (check_data.status != 1) {
    return res.status(400).json({ message: check_data.message });
  } else {
    let data = check_data.data;
    return res.status(200).json(data);
  }
};

const postIndex = async (req, res) => {
  let check_data = await commonQuery(Event, "findOne", { _id: req.body._id });
  if (check_data.status != 1) {
    return res.status(400).json({ message: "Invalid Event." });
  } else {
    let new_eventName = !req.body.event_name
      ? check_data.data.event_name
      : req.body.event_name;
    let new_eventUrl = !req.body.event_url
      ? check_data.data.event_url
      : req.body.event_url;
    let new_visit = !req.body.visit ? check_data.data.visit : req.body.visit;
    let new_totalCredit = !req.body.total_credit
      ? check_data.data.total_credit
      : req.body.total_credit;
    let new_adminName = !req.body.admin_name ? check_data.data.admin_name : req.body.admin_name;
    let new_adminEmail = !req.body.admin_email ? check_data.data.admin_email : req.body.admin_email;
    let new_adminPassword = !req.body.admin_password
      ? check_data.data.admin_password
      : bcrypt.hashSync(req.body.admin_password, 9);
    let new_startDate = !req.body.start_date ? check_data.data.start_date : req.body.start_date;
    let new_endDate = !req.body.end_date ? check_data.data.end_date : req.body.end_date;

    const update_data = await commonQuery(
      Event,
      "findOneAndUpdate",
      { _id: req.body._id },
      {
        total_credit: new_totalCredit,
        visit: new_visit,
        event_name: new_eventName,
        event_url: new_eventUrl,
        admin_name: new_adminName,
        admin_email: new_adminEmail,
        admin_password: new_adminPassword,
        start_date: new_startDate,
        end_date: new_endDate,
      }
    );
    if (update_data.status != 1) {
      return res.status(400).json({ message: "Error, Please try again." });
    } else {
      return res.status(200).json({ message: "Event updated successfully." });
    }
  }
};

export default update;
