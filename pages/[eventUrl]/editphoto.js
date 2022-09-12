import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Slider from "react-slick";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import axios from "axios";
import { FiCornerUpLeft } from "react-icons/fi";
import RedirectToSevenue from '../../components/RedirectToSevenue'
import { compose } from "../../components/Stickers/ImageUtil";

import EventLogin from "../../components/EventLogin/EventLogin";
import ChangeBackground from "../../components/ChangeBackground/ChangeBackground";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import StickerDropzone from "../../components/Stickers/StickerDropZone";
import StickerToolbar from "../../components/Stickers/StickerToolbar";
import bg_ic from "../../public/images/bg_ic.svg";
import sticker_ic from "../../public/images/sticker_ic.svg";
import arrowRight from "../../public/images/icons/arrowRight2_white.svg";
import arrowLeft from "../../public/images/icons/arrowLeft2_white.svg";
import shareIcon from "../../public/images/icons/Share_white.svg";

import * as StickerUtil from "../../components/Stickers/StickerUtils";
import { toast } from "react-toastify";

const EditPhoto = ({ data }) => {
  const router = useRouter();
  const { eventUrl } = router.query;
  const [showBackground, setShowBackground] = useState(true);
  const [localImg, setLocalImg] = useState(null);
  const [imgWidth, setImgWidth] = useState(450);
  const [backImg, setBackImg] = useState(null);
  const [totalBgs, setTotalBgs] = useState(data.photo_backgrounds);
  const [totalStickers, setTotalStickers] = useState(data.photo_stickers);
  const [overlayimage, setOverlayimage] = useState(data.photo_overview);
  const [removeBgs, setRemoveBgs] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [localFileName, setLocalFileName] = useState(null);
  const [localFileSize, setLocalSizeName] = useState(null);
  const [eventBg, setEventBg] = useState(null);
  const [postLoader, setPostLoader] = useState(false);
  const FinalImage = useRef(null);
  const CanvasImage = useRef(null);

  const changeBackgroundHandler = useCallback(
    async (backImg) => {
      try {
        const croppedImage = await ChangeBackground(
          localImg,
          backImg,
          imgWidth
        );
        setBackImg(croppedImage.url);
        setFileName(croppedImage.file);
      } catch (e) {
        console.error("Error ::", e);
      }
    },
    [localImg, imgWidth]
  );

  useEffect(() => {
    setEventBg(localStorage.getItem("eventBackground"));
  }, []);

  useEffect(() => {
    if (eventUrl) {
      async function fetchData() {
        const checkCropImage = await localStorage.getItem("CropImage");
        if (!checkCropImage) {
          return Router.push(`/${eventUrl}`);
        }
        const FileImageName = await localStorage.getItem("FileImageName");
        setLocalFileName(FileImageName);
        const FileImageSize = await localStorage.getItem("FileImageSize");
        setLocalSizeName(FileImageSize);
        setBackImg(totalBgs[0]);
        setLocalImg(checkCropImage);
        const checkRemoveBg = await localStorage.getItem("checkRemoveBg");
        setRemoveBgs(checkRemoveBg === "true");
        if(totalBgs[0]){
          changeBackgroundHandler(totalBgs[0]);
        }
      }
      fetchData();
    }
  }, [eventUrl, changeBackgroundHandler, totalBgs]);

  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        "slick-prev slick-arrow customArrow" +
        (currentSlide === 0 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
      type="button"
    >
      <Image src={arrowLeft} width={20} height={20} alt="Camera Access" />
    </button>
  );
  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        "slick-next slick-arrow customArrow" +
        (currentSlide === slideCount - 1 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === slideCount - 1 ? true : false}
      type="button"
    >
      <Image src={arrowRight} width={20} height={20} alt="Camera Access" />
    </button>
  );

  const backgroundSettings = {
    dots: false,
    infinite: false,
    autoplay: false,
    draggable: false,
    nextArrow: <SlickArrowRight />,
    prevArrow: <SlickArrowLeft />,
    slidesToShow: 5,
    slidesToScroll: 1,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const selectSticker = (img) => {
    StickerUtil.addSticker(img);
  };

  const urlToObject = async (image) => {
    const response = await fetch(image);
    // here image is url/location of image
    const blob = await response.blob();
    return new File([blob], `${Date.now()}.png`, { type: blob.type });
  };

  const CanvasImageHandler = async () => {
    setPostLoader(true);
    let stickers = Array.from(
      document.querySelectorAll("#stickersDropzone > .sticker")
    );

    let canvas = CanvasImage.current;
    let Image = await compose(
      localImg,
      overlayimage,
      backImg,
      stickers,
      canvas
    );
    let mainImage = await urlToObject(Image);

    const formData = new FormData();
    formData.append("fileName", fileName ? fileName.name : localFileName);
    formData.append("fileSize", fileName ? fileName.size : localFileSize);
    formData.append("name", localStorage.getItem("name"));
    formData.append("email", localStorage.getItem("mail"));
    formData.append("image", mainImage);
    formData.append("used_credit", data.used_credit);
    formData.append("total_credit", data.total_credit);

    await axios
      .post(`${window.location.origin}/api/${eventUrl}`, formData)
      .then((res) => {
        localStorage.setItem("FinishImage", res.data.image);
        localStorage.removeItem("CropImage");
        setPostLoader(false);
        return Router.push(`/${eventUrl}/finishimage`);
      })
      .catch((err) => {
        toast.error(err.response.data.message)
        return setPostLoader(false);
      });
    // localStorage.setItem("FinishImage", Image);
    // localStorage.removeItem("CropImage");
    // Router.push(`/${eventUrl}/finishimage`);
  };
  return (
    <EventLogin>
      <section
        className="userInterface-content-box"
        style={{ backgroundImage: `url(${eventBg ? eventBg : ""})` }}
      >
        <RedirectToSevenue />
        <div className="container-fluid ">
          <canvas
            className="hiddenCanvas"
            width="1000"
            height="1000"
            ref={CanvasImage}
          ></canvas>
          <div className="row justify-content-center editImageScreen">
            <div className="col-md-10 col-lg-8 col-xl-6">
              <div className="editImageBox">
                {backImg ? (
                  <div
                    id="finalImageCanvas"
                    className="ImageDropBox"
                    ref={FinalImage}
                  >
                    <Image
                      src={backImg}
                      width={imgWidth}
                      height={imgWidth}
                      alt=""
                    />
                    <div className="OverlayImage">
                      <Image
                        src={overlayimage}
                        width={imgWidth}
                        height={imgWidth}
                        alt=""
                      />
                    </div>
                    <StickerDropzone />
                  </div>
                ) : (
                  <div className="loader"></div>
                )}
              </div>
              {!removeBgs ? (
                <>
                  <p className="bgRemoveError">
                    We couldn`t remove the background. You can continue with
                    your background or retry by pressing retake
                  </p>
                </>
              ) : null}
              <div className="addEffectBox">
                <div className="tabButtons">
                  <button
                    className={showBackground ? "active" : ""}
                    onClick={() => setShowBackground(true)}
                  >
                    <Image src={bg_ic} width={25} height={25} alt="" />
                    <span className="ml-2">Background</span>
                  </button>
                  <button
                    className={!showBackground ? "active" : ""}
                    onClick={() => setShowBackground(false)}
                  >
                    <Image src={sticker_ic} width={25} height={25} alt="" />
                    <span className="ml-2">Stickers</span>
                  </button>
                </div>
                {showBackground ? (
                  <div className="backgrounds sliderBox">
                    <Slider {...backgroundSettings}>
                      {totalBgs.map((img, i) => {
                        return (
                          <div key={"bg" + i} style={{ width: 90 }}>
                            <Image
                              src={img}
                              width={80}
                              height={80}
                              alt=""
                              onClick={(e) => changeBackgroundHandler(`${img}`)}
                            />
                          </div>
                        );
                      })}
                    </Slider>
                  </div>
                ) : totalStickers ? (
                  <StickerToolbar
                    stickers={totalStickers}
                    handleSticker={(sticker) => selectSticker(sticker)}
                  />
                ) : null}
              </div>
              <div className="nextPrevBtns">
                <Link href={`/${eventUrl}/uploadphoto`} passHref={true}>
                  <button>
                    <FiCornerUpLeft />
                    <br /> Retake
                  </button>
                </Link>
                <button onClick={() => CanvasImageHandler()} disabled={postLoader}>
                  <div className="postIcon">
                    <Image
                      src={shareIcon}
                      width={30}
                      height={30}
                      alt="Camera Access"
                    />
                  </div>{" "}
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </EventLogin>
  );
};

export default EditPhoto;

export async function getServerSideProps(context) {
  const { eventUrl } = context.query;
  const res = await fetch(`${process.env.base_url}api/${eventUrl}`);
  const data = await res.json();
  // Fetch data from external API

  // Pass data to the page via props
  return { props: { data } };
}
