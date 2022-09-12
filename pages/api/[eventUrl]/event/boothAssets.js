import nextConnect from "next-connect";
import connectDB from "../../../../middleware/mongodb";
import { commonQuery, s3Upload } from "../../../../middleware/helper";
import Event from "../../../../models/event";
import formidable from 'formidable-serverless';

connectDB();

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.get(async (req, res) => {
  const check_data = await commonQuery(Event, "findOne", { event_url: req.query.eventUrl }, {}, "photo_backgrounds photo_stickers photo_overview event_url");
  if (check_data.status != 1) {
    return res.status(400).json({ message: "Invalid Event." });
  }
  return res.status(200).json(check_data.data);
});

apiRoute.post(async (req, res) => {
  let check_data = await commonQuery(Event, "findOne", {
    event_url: req.query.eventUrl,
  });
  if (check_data.status != 1) {
    return res.status(400).json({ message: "Invalid Event." });
  } else {

    // parse request to readable form
    const form = new formidable.IncomingForm();
    form.multiples = true; //use this while dealing with multiple files
    form.parse(req, async (err, fields, files) => {
      // Account for parsing errors
      if (err) return res.status(400).json({ message: "Fetch value Error, Please try again." });
      const overview = files.overview ? await s3Upload(files.overview) : { status: false };
      const backgrounds = files.backgrounds ? files.backgrounds.length ? await Promise.all(await files.backgrounds.map(async v => await s3Upload(v))) : [await s3Upload(files.backgrounds)] : false;
      const stickers = files.stickers ? files.stickers.length ? await Promise.all(await files.stickers.map(async v => await s3Upload(v))) : [await s3Upload(files.stickers)] : false;

      let new_photoOverview = !overview.status ? check_data.data.photo_overview : overview.url;
      let new_photoStickers = !stickers ? check_data.data.photo_stickers : stickers.map(v => v.url);
      let new_photoBackgrounds = !backgrounds ? check_data.data.photo_backgrounds : backgrounds.map(v => v.url);

      const update_data = await commonQuery(Event, "findOneAndUpdate",
        { _id: check_data.data._id },
        {
          photo_backgrounds: new_photoBackgrounds,
          photo_stickers: new_photoStickers,
          photo_overview: new_photoOverview,
        }
      );
      if (update_data.status != 1) {
        return res.status(400).json({ message: "Update Error, Please try again." });
      } else {
        return res.status(200).json({ message: "Assets updated." });
      }
    });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};