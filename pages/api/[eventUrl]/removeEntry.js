import connectDB from "../../../middleware/mongodb";
import { commonQuery } from "../../../middleware/helper";
import Entries from "../../../models/entries";

connectDB();

const deleteFn = async (req, res) => {
  let deleteString = req.query.deleteids.split(",");

  if (req.method === "DELETE") {
    let check_data = await commonQuery(Entries, "deleteMany", {
      _id: {
        $in: deleteString,
      },
    });
    if (check_data.status != 1) {
      return res.status(400).json({ message: "Error, please try again." });
    } else {
      return res.status(200).json({ message: "Entries deleted successfully." });
    }
  } else {
    return res.status(422).send({ message: "req method not supported" });
  }
  return res.status(200).send({ message: "req method not supported" });
};

export default deleteFn;
