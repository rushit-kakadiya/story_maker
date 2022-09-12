import nextConnect from 'next-connect';
import formidable from 'formidable-serverless';
import connectDB from '../../../../middleware/mongodb';
import { commonQuery, s3Upload } from '../../../../middleware/helper';
import Event from '../../../../models/event';

connectDB();

const apiRoute = nextConnect({
    // onError(error, req, res) {
    //     res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    // },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});


apiRoute.get(async (req, res) => {
    let check_data = await commonQuery(Event, 'findOne', { event_url: req.query.eventUrl });
    if (check_data.status != 1) {
        return res.status(400).json({ message: "Invalid Event." });
    }
    return res.status(200).json(check_data.data);
})

apiRoute.post(async (req, res) => {
    let check_data = await commonQuery(Event, "findOne", { event_url: req.query.eventUrl });
    if (check_data.status != 1) {
        return res.status(400).json({ message: "Invalid Event." });
    }

    // parse request to readable form
    const form = new formidable.IncomingForm();
    form.multiples = true; //use this while dealing with multiple files
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({ message: "Error, Please try again." });
        }
        // Account for parsing errors
        const { eventName, hashtag, themeColor, header, subHeader, h_font_color, h_font_family, h_text_size_desktop, h_text_size_tablet, h_text_size_mobile, s_font_family, s_font_color, s_text_size_desktop, s_text_size_tablet, s_text_size_mobile, buttonText, buttonStyle, buttonColor } = fields;

        /* const res_logo = await uploadImage(logo);
        if (!res_logo.status) {
            return res.status(401).json({ message: "Invalid logo." });
        }
        const res_background = await uploadImage(background);
        if (!res_background.status) {
            return res.status(401).json({ message: "Invalid background." });
        } */

        let new_eventName = !eventName ? check_data.data.event_name : eventName;
        let new_hashtag = !hashtag ? check_data.data.hashtag : hashtag;
        let new_themeColor = !themeColor ? check_data.data.theme_color : themeColor;
        let new_header = !header ? check_data.data.header : header;
        let new_h_font_color = !h_font_color ? check_data.data.header_font_style.font_color : h_font_color;
        let new_h_font_family = !h_font_family ? check_data.data.header_font_style.font_family : h_font_family;
        let new_h_text_size_desktop = !h_text_size_desktop ? check_data.data.header_font_style.text_size_desktop : h_text_size_desktop;
        let new_h_text_size_tablet = !h_text_size_tablet ? check_data.data.header_font_style.text_size_tablet : h_text_size_tablet;
        let new_h_text_size_mobile = !h_text_size_mobile ? check_data.data.header_font_style.text_size_mobile : h_text_size_mobile;
        let new_subHeader = !subHeader ? check_data.data.sub_header : subHeader;
        let new_s_font_color = !s_font_color ? check_data.data.sub_header_font_style.font_color : s_font_color;
        let new_s_font_family = !s_font_family ? check_data.data.sub_header_font_style.font_family : s_font_family;
        let new_s_text_size_desktop = !s_text_size_desktop ? check_data.data.sub_header_font_style.text_size_desktop : s_text_size_desktop;
        let new_s_text_size_tablet = !s_text_size_tablet ? check_data.data.sub_header_font_style.text_size_tablet : s_text_size_tablet;
        let new_s_text_size_mobile = !s_text_size_mobile ? check_data.data.sub_header_font_style.text_size_mobile : s_text_size_mobile;
        let new_buttonText = !buttonText ? check_data.data.button_text : buttonText;
        let new_buttonStyle = !buttonStyle ? check_data.data.button_style : buttonStyle;
        let new_buttonColor = !buttonColor ? check_data.data.button_color : buttonColor;

        const logo = await s3Upload(files.logo);
        const background = await s3Upload(files.background);
        let new_logo = !logo.status ? check_data.data.logo : logo.url;
        let new_background = !background.status ? check_data.data.background : background.url;

        const update_data = await commonQuery(Event, "findOneAndUpdate", { _id: check_data.data._id },
            {
                hashtag: new_hashtag,
                header: new_header,
                header_font_style: {
                    font_color: new_h_font_color,
                    font_family: new_h_font_family,
                    text_size_desktop: new_h_text_size_desktop,
                    text_size_tablet: new_h_text_size_tablet,
                    text_size_mobile: new_h_text_size_mobile,
                },
                theme_color: new_themeColor,
                event_name: new_eventName,
                sub_header: new_subHeader,
                sub_header_font_style: {
                    font_color: new_s_font_color,
                    font_family: new_s_font_family,
                    text_size_desktop: new_s_text_size_desktop,
                    text_size_tablet: new_s_text_size_tablet,
                    text_size_mobile: new_s_text_size_mobile,
                },
                button_text: new_buttonText,
                button_style: new_buttonStyle,
                button_color: new_buttonColor,
                logo: new_logo,
                background: new_background
            });
        if (update_data.status != 1) {
            return res.status(400).json({ message: "Error, Please try again." });
        } else {
            return res.status(200).json({ message: "Event settings saved." });
        }
    });
})

export default apiRoute;

export const config = {
    api: {
        bodyParser: false
    },
}