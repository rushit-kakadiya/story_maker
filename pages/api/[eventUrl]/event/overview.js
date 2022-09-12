import connectDB from "../../../../middleware/mongodb";
import { commonQuery } from "../../../../middleware/helper";
import Event from "../../../../models/event";

connectDB();

const overview = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getOverview(req, res);
      break;
    default:
      res.status(422).send({ message: "req method not supported" });
      break;
  }
};

const getOverview = async (req, res) => {
  const check_data = await commonQuery(Event, "findOne", {
    event_url: req.query.eventUrl,
  });
  if (check_data.status != 1) {
    return res.status(400).json({ message: check_data.message });
  }
  return res.status(200).json(check_data.data);
};

export default overview;
