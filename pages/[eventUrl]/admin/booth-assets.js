import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BsUpload } from "react-icons/bs";
import { FaSave, FaPlus, FaTimes } from "react-icons/fa";
import EventAdminLogin from "../../../components/EventAdminLogin/EventAdminLogin";
import RedirectToSevenue from '../../../components/RedirectToSevenue'

const BoothAssets = () => {
  const router = useRouter();
  const { eventUrl } = router.query;

  const [bgImg, setBgImg] = useState("");
  const [photoOverview, setPhotoOverview] = useState(null);

  const [bgImgFiles, setBgImgFiles] = useState([]);
  const [photoBackgrounds, setPhotoBackgrounds] = useState([]);

  const [stickerFiles, setStickerFiles] = useState([]);
  const [photoStickers, setPhotoStickers] = useState([]);
  const [settingLoader, setSettingLoader] = useState(false);

  useEffect(() => {
    if (eventUrl) {
      fetchAssets(eventUrl);
    }
  }, [eventUrl]);

  const urlToObject = async (image) => {
    const response = await fetch(image);
    // here image is url/location of image
    const blob = await response.blob();
    return new File([blob], image.replace(`${process.env.url}`, ""), {
      type: blob.type,
    });
  };

  const fetchAssets = async (eventUrl) => {
    await axios
      .get(`${window.location.origin}/api/${eventUrl}/event/boothAssets`)
      .then(async (res) => {
        setBgImg(res.data.photo_overview);
        setBgImgFiles(res.data.photo_backgrounds);
        setStickerFiles(res.data.photo_stickers);

        setPhotoOverview(await urlToObject(res.data.photo_overview));
        setPhotoBackgrounds(
          await Promise.all(
            await res.data.photo_backgrounds.map(
              async (value) => await urlToObject(value)
            )
          )
        );
        setPhotoStickers(
          await Promise.all(
            await res.data.photo_stickers.map(
              async (value) => await urlToObject(value)
            )
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleBgChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = function (ev) {
        setPhotoOverview(e.target.files[0]);
        setBgImg(ev.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const addBgImgFileHandler = (e) => {
    let ImagesArray = Object.entries(e.target.files).map((e) =>
      URL.createObjectURL(e[1])
    );
    let bgFileArray = Object.entries(e.target.files).map((e) => e[1]);
    const newImgArray = [...bgImgFiles, ...ImagesArray];
    const newBgFilesArray = [...photoBackgrounds, ...bgFileArray];
    if (newImgArray.length > 10) {
      setBgImgFiles(newImgArray.slice(0, 10));
      setPhotoBackgrounds(newBgFilesArray.slice(0, 10));
    } else {
      setBgImgFiles(newImgArray);
      setPhotoBackgrounds(newBgFilesArray);
    }
  };

  const deleteBgImgFileHandler = (i) => {
    const blobUrl = bgImgFiles.filter((item, index) => index !== i);
    setBgImgFiles(blobUrl);
    const files = photoBackgrounds.filter((item, index) => index !== i);
    setPhotoBackgrounds(files);
  };

  const addStickerFileHandler = (e) => {
    let ImagesArray = Object.entries(e.target.files).map((e) =>
      URL.createObjectURL(e[1])
    );
    let stickersFileArray = Object.entries(e.target.files).map((e) => e[1]);
    const newImgArray = [...stickerFiles, ...ImagesArray];
    const newStickerFilesArray = [...photoStickers, ...stickersFileArray];
    if (newImgArray.length > 10) {
      setStickerFiles(newImgArray.slice(0, 10));
      setPhotoStickers(newStickerFilesArray.slice(0, 10));
    } else {
      setStickerFiles(newImgArray);
      setPhotoStickers(newStickerFilesArray);
    }
  };

  const deleteStickerFileHandler = (i) => {
    const blobUrl = stickerFiles.filter((item, index) => index !== i);
    setStickerFiles(blobUrl);
    const files = photoStickers.filter((item, index) => index !== i);
    setPhotoStickers(files);
  };

  const submit = (e) => {
    e.preventDefault();
    setSettingLoader(true);
    const formData = new FormData();
    formData.append("overview", photoOverview);
    photoBackgrounds.forEach((item) => formData.append("backgrounds", item));
    photoStickers.forEach((item) => formData.append("stickers", item));

    axios
      .post(
        `${window.location.origin}/api/${eventUrl}/event/boothAssets`,
        formData
      )
      .then((res) => {
        toast.success("Assets updated", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        fetchAssets();
        setSettingLoader(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setSettingLoader(false);
      });
  };

  return (
    <EventAdminLogin nav={true}>
      <section className="adminInterface-content-box">
      <RedirectToSevenue />
        <div className="workspace boothAssetsBox">
          <div className="boothDetails">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="bgBox">
                  <h3>Splash Screen Settings</h3>
                  <div className="detailsBox">
                    <div className="inputBox align-items-start">
                      <div className="labelTexts">
                        <label>Photobooth Background</label>
                        <p>(1080x1080px with transparent background)</p>
                      </div>
                      <div className="bgUploadBox">
                        <>
                          <label htmlFor={"bgUpload"} className="button">
                            <BsUpload />
                            Upload your image(s)
                          </label>
                          <input
                            id={"bgUpload"}
                            type="file"
                            onChange={(e) => handleBgChange(e)}
                            className="show-for-sr"
                            accept=".png, .jpg, .jpeg"
                          />
                        </>
                        {bgImg ? (
                          <Image
                            className=""
                            src={bgImg}
                            alt=""
                            layout="fill"
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="inputBox align-items-start">
                      <div className="labelTexts">
                        <label>Photo Background</label>
                        <p>(up to 10 images)</p>
                      </div>
                      <div className="addImgsBox">
                        {bgImgFiles
                          ? bgImgFiles.map((img, i) => {
                              return (
                                <div
                                  className="selectedImg"
                                  key={"stickerImg" + i}
                                >
                                  <button
                                    className="closeBtn"
                                    onClick={() => deleteBgImgFileHandler(i)}
                                  >
                                    <FaTimes />
                                  </button>
                                  <Image
                                    className=""
                                    src={img}
                                    alt=""
                                    layout="fill"
                                  />
                                </div>
                              );
                            })
                          : null}
                        {bgImgFiles.length < 10 ? (
                          <div className="addImgsBtn">
                            <label htmlFor={"addBgImages"} className="button">
                              <FaPlus />
                              Add image
                            </label>
                            <input
                              id={"addBgImages"}
                              type="file"
                              onChange={(e) => addBgImgFileHandler(e)}
                              className="show-for-sr"
                              multiple
                              accept=".png, .jpg, .jpeg"
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="inputBox align-items-start">
                      <div className="labelTexts">
                        <label>Photo Stickers</label>
                        <p>(transparent background, up to 10 images)</p>
                      </div>
                      <div className="addImgsBox">
                        {stickerFiles
                          ? stickerFiles.map((img, i) => {
                              return (
                                <div
                                  className="selectedImg"
                                  key={"stickerImg" + i}
                                >
                                  <button
                                    className="closeBtn"
                                    onClick={() => deleteStickerFileHandler(i)}
                                  >
                                    <FaTimes />
                                  </button>
                                  <Image
                                    className=""
                                    src={img}
                                    alt=""
                                    layout="fill"
                                  />
                                </div>
                              );
                            })
                          : null}
                        {stickerFiles.length < 10 ? (
                          <div className="addImgsBtn">
                            <label htmlFor={"addSticker"} className="button">
                              <FaPlus />
                              Add image
                            </label>
                            <input
                              id={"addSticker"}
                              type="file"
                              onChange={(e) => addStickerFileHandler(e)}
                              className="show-for-sr"
                              multiple
                              accept=".png, .jpg, .jpeg"
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <button
                      className="blueSaveBtn"
                      onClick={submit}
                      disabled={settingLoader}
                    >
                      {settingLoader ? (
                        "Loading..."
                      ) : (
                        <>
                          <FaSave />
                          Save Setting
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </EventAdminLogin>
  );
};

export default BoothAssets;
