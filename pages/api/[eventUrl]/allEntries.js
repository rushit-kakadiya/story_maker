import nextConnect from 'next-connect';
import connectDB from '../../../middleware/mongodb';
import { commonQuery } from '../../../middleware/helper';
import Entries from '../../../models/entries';

connectDB();

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.get(async (req, res) => {
    // let check_data = await commonQuery(Entries, "find", { event_url: req.query.eventUrl })
    // if (check_data.status != 1) {
    //     return res.status(400).json({ message: "Invalid Data." });
    // }
    // return res.status(200).json(check_data.data);

    let perPage = Number.parseInt(req.query.perPage)
    let page = Number.parseInt(req.query.page)
    let getData;
    if (perPage && page) {
        getData = await Entries.find({ event_url: req.query.eventUrl }).limit(perPage).skip(perPage * (page - 1))
    } else {
        
        getData = await Entries.find({ event_url: req.query.eventUrl });
    }

    let count = await Entries.find({ event_url: req.query.eventUrl }).count();

    if (getData) {
        return res.status(200).json({count, getData});
    } else {
        return res.status(400).json({ message: "No data found" });
    }
})

export default apiRoute;

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "50mb"
        },
    },
};