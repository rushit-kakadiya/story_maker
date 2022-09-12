import AWS from "aws-sdk";
import * as fs from "fs";

export async function commonQuery(
  model,
  query,
  data,
  update = {},
  select = "",
  populate = null
) {
  try {
    let res;
    switch (query) {
      case "find":
        res = await model.find(data).select(select).populate(populate);
        break;
      case "findOne":
        res = await model.findOne(data).select(select).populate(populate);
        break;
      case "create":
        res = await model.create(data);
        break;
      case "findOneAndUpdate":
        res = await model.findOneAndUpdate(data, update, { new: true });
        break;
      case "upsert":
        res = await model.findOneAndUpdate(data, update, {
          upsert: true,
          new: true,
        });
        break;
      case "deleteMany":
        res = await model.deleteMany(data);
        break;
      case "deleteOne":
        res = await model.deleteOne(data);
        break;
    }
    if (!res || res.length == 0 || !data) {
      return {
        status: 2,
        message: "No Data Found.",
      };
    } else {
      return { status: 1, data: res };
    }
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

export async function uploadImage(image) {
  const imgName = Date.now() + Math.round(54648544 + Math.random() * 1e9);
  try {
    fs.writeFileSync(
      `public/images/${imgName}.png`,
      image.replace(/^data:image\/png;base64,/, "") ||
        image.replace(/^data:image\/jpg;base64,/, "") ||
        image.replace(/^data:image\/jpeg;base64,/, ""),
      "base64"
    );
    return { status: true, img_name: `${imgName}.png` };
  } catch (error) {
    return { status: false, err: error.message };
  }
}

export async function s3Upload(file) {
  // create S3 instance with credentials
  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(process.env.DIGITALOCEAN_SPACES_ENDPOINT),
    accessKeyId: process.env.DIGITALOCEAN_SPACES_KEY,
    secretAccessKey: process.env.DIGITALOCEAN_SPACES_SECRET,
    region: process.env.DIGITALOCEAN_SPACES_REGION,
  });

  if (!file || !file.path) {
    return { status: false };
  }

  // Read file
  const newFile = fs.readFileSync(file.path);
  const fileName = `${Date.now() + Math.round(54648544 + Math.random() * 1e9)}`;

  const params = {
    // params
    Bucket: process.env.DIGITALOCEAN_SPACES_BUCKET,
    ACL: "public-read",
    Key: fileName,
    Body: newFile,
    ContentType: "image/jpeg" || "image/jpg" || "image/png",
  };
  // Upload the file
  const data = await s3.upload(params).promise();
  if (!data) {
    return { status: false };
  }
  return { status: true, url: data.Location };
}
