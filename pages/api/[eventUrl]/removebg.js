import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import path from 'path';

const removeBg = async (req, res) => {
    let fileName = Date.now();
    fs.writeFile(`public/images/${fileName}.png`, req.body.img.replace(/^data:image\/png;base64,/, ""), 'base64', (err) => {
        if (err) {
            return console.log(err.message);
        }
        console.log("Image saved successfully");
    });
    const inputPath = `public/images/${fileName}.png`;
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));

    await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        responseType: 'arraybuffer',
        headers: {
            ...formData.getHeaders(),
            'X-Api-Key': process.env.REMOVE_BG_KEY,
        },
        encoding: null
    })
        .then(async (response) => {
            if (response.status != 200) {
                return console.error('Error:');
            }
            fs.unlinkSync(`public/images/${fileName}.png`);
            let img = Buffer.from(response.data, 'binary').toString('base64');
            return res.send(`data:image/png;base64,${img}`)
        })
        .catch((error) => {
            return res.send({
                status: 'failure',
                removeBg: false
            });
        });
}

export default removeBg;

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "50mb"
        },
    },
};