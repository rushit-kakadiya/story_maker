import nextConnect from "next-connect";
import formidable from "formidable-serverless";
import connectDB from "../../../middleware/mongodb";
import { commonQuery, s3Upload } from "../../../middleware/helper";
import Event from "../../../models/event";
import Entries from "../../../models/entries";

connectDB();

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.get(async (req, res) => {
  let check_data = await commonQuery(Event, "findOne", {
    event_url: req.query.eventUrl,
  });
  if (check_data.status != 1) {
    return res.status(400).json({ message: "Invalid Event." });
  }

  let check_credit = await commonQuery(Event, "findOne", {
    event_url: req.query.eventUrl,
    used_credit: { $lt: check_data.data.total_credit },
  });

  if (check_credit.status != 1) {
    return res.status(400).json({ message: "Credit expired." });
  }
  return res.status(200).json(check_credit.data);
});

apiRoute.post(async (req, res) => {
  if (req.query.visit) {
    const update_data = await commonQuery(
      Event,
      "findOneAndUpdate",
      { event_url: req.query.eventUrl },
      { visit: req.query.visit }
    );
    if (update_data.status != 1) {
      return res.status(400).json({ message: "Error to update visit." });
    }
    return res.status(200).json({ message: "Event Visit updated." });
  }

  // parse request to readable form
  const form = new formidable.IncomingForm();
  form.multiples = true; //use this while dealing with multiple files
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ message: "Error, Please try again." });
    }

    const check_credit = await commonQuery(Event, "findOne", {
      event_url: req.query.eventUrl,
      used_credit: { $lt: fields.total_credit },
    });

    if (check_credit.status != 1) {
      return res.status(400).json({ message: "Error to update credit." });
    }

    const update_data = await commonQuery(
      Event,
      "findOneAndUpdate",
      {
        event_url: req.query.eventUrl,
        used_credit: { $lt: fields.total_credit },
      },
      { used_credit: parseInt(fields.used_credit) + 1 }
    );

    if (update_data.status != 1) {
      return res.status(400).json({ message: "Error to update credit." });
    }

    const image = await s3Upload(files.image);
    if (!image.status) {
      return res.status(400).json({ message: "Invalid image." });
    }

    let check_data = await commonQuery(Entries, "create", {
      name: fields.name,
      email: fields.email,
      event_url: req.query.eventUrl,
      file_name: fields.fileName,
      file_size: fields.fileSize,
      image: image.url,
    });

    if (check_data.status != 1) {
      return res.status(400).json({ message: "Invalid Data." });
    }

    return res.status(200).json(check_data.data);
  });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
