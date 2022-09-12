import React, { useState, useCallback, useRef, useEffect } from "react";
import EventLogin from "../../components/EventLogin/EventLogin";
import Slider from "@material-ui/core/Slider";
import Cropper from "react-easy-crop";
import GetCroppedImg from "../../components/GetCropImage/GetCropImage";
import Router, { useRouter } from "next/router";
import Webcam from "react-webcam";
import QRCode from "qrcode.react";
import { IoMdReverseCamera } from "react-icons/io";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import Image from "next/image";
import cameraAccess from "../../public/images/camera_ic.svg";
import swithModalIc from "../../public/images/icons/switchDevice_grey.svg";
import cameraIc from "../../public/images/icons/camera-white.svg";
import libraryIc from "../../public/images/icons/library-grey.svg";
import rotateRightIc from "../../public/images/icons/flipRight_white.svg";
import rotateLeftIc from "../../public/images/icons/flip_white.svg";
import RedirectToSevenue from '../../components/RedirectToSevenue'

const UploadPhoto = ({data}) => {
  const router = useRouter();
  const { eventUrl } = router.query;
  const webcamRef = useRef(null);
  const [qrModal, setQrModal] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [devices, setDevices] = useState([]);
  const [currentCam, setCurrentCam] = useState(0);
  const [saveLoader, setSaveLoader] = useState(false);
  const [cameraAccessModal, setCameraAccessModal] = useState(true);
  const [cameraPermission, setCameraPermission] = useState(true);
  const [captureAni, setCaptureAni] = useState(false);
  const [count, setCount] = useState(3);
  const [darkBack, setDarkBack] = useState(false);
  const [eventBg, setEventBg] = useState(null);

  useEffect(() => {
    const host = window.location.href;
    setCurrentUrl(host);
  }, []);

  // const handleDevices = useCallback(
  //   (mediaDevices) => {
  //     setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput"));
  //   },
  //   []
  // );
  {
    /* UploadImage States */
  }

  {
    /* CropImage Modal States */
  }
  const [modalShow, setModalShow] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [imgUrl, setImgUrl] = useState(null);
  const inputFile = useRef(null);
  useEffect(() => {
    setEventBg(localStorage.getItem("eventBackground"));
  }, []);
  {
    /* UploadImage Handler */
  }

  const readURI = (e) => {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = function (ev) {
        setImgUrl(ev.target.result);
        setModalShow(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    readURI(e);
  };

  //   const imgTag = buildImgTag();
  {
    /* CropImage Modal Handler */
  }
  const handleClose = () => {
    setSaveLoader(false);
    setModalShow(false);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    setSaveLoader(true);
    localStorage.removeItem("CropImage");
    localStorage.removeItem("checkRemoveBg");
    try {
      const croppedImage = await GetCroppedImg(
        imgUrl,
        croppedAreaPixels,
        rotation
      );
      /* Remove Bg API */
      await axios
        .post(`${window.location.origin}/api/${eventUrl}/removebg`, {
          img: croppedImage.url,
        })
        .then((res) => {
          if (res.data.removeBg === false) {
            localStorage.setItem("FileImageName", croppedImage.file.name);
            localStorage.setItem("FileImageSize", croppedImage.file.size);
            localStorage.setItem("CropImage", croppedImage.url);
            localStorage.setItem("checkRemoveBg", false);
            Router.push(`/${eventUrl}/editphoto`);
          } else {
            // localStorage.setItem("FileImage", {name: croppedImage.file.name, size: croppedImage.file.size});
            localStorage.setItem("FileImageName", croppedImage.file.name);
            localStorage.setItem("FileImageSize", croppedImage.file.size);
            localStorage.setItem("CropImage", res.data);
            localStorage.setItem("checkRemoveBg", true);
            Router.push(`/${eventUrl}/editphoto`);
            setSaveLoader(false);
          }
        })
        .catch((err) => {
          localStorage.setItem("CropImage", croppedImage.url);
          localStorage.setItem("checkRemoveBg", false);
          Router.push(`/${eventUrl}/editphoto`);
        });
      // localStorage.setItem("CropImage", croppedImage.url);
      // Router.push(`/${eventUrl}/editphoto`);
    } catch (e) {
      console.error(e);
    }
  }, [imgUrl, croppedAreaPixels, rotation, eventUrl]);

  const rotateHandler = (dir) => {
    if (dir == "right") {
      setRotation(rotation + 90);
    } else if (dir == "left") {
      setRotation(rotation - 90);
    }
  };

  const capture = useCallback(() => {
    setDarkBack(true);
    setCaptureAni(true);
    setTimeout(() => {
      setCount(2);
    }, 1000);
    setTimeout(() => {
      setCount(1);
    }, 2000);
    setTimeout(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setCount(3);
        setImgUrl(imageSrc);
        setCaptureAni(false);
        setDarkBack(false);
        setModalShow(true);
      }
    }, 3000);
  }, [webcamRef]);

  const changeCameraHandler = () => {
    if (currentCam === 0) {
      setCurrentCam(1);
    } else {
      setCurrentCam(0);
    }
  };

  const userMediaHandler = async () => {
    setCameraAccessModal(false);
    navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
      let videoDevices = mediaDevices.filter(
        ({ kind }) => kind === "videoinput"
      );
      setDevices(videoDevices);
    });
  };

  const userMediaErrorHandler = () => {
    setCameraAccessModal(false);
    setCameraPermission(false);
  };

  return (
    <EventLogin>
      {/* Upload Image */}
      {cameraPermission ? (
        <section
          className={`userInterface-content-box ${darkBack ? "darkBack" : ""}`}
          style={{backgroundImage: `url(${eventBg ? eventBg : ''})`}}
        >
          <RedirectToSevenue />
          <div className="container-fluid capturePhoto">
            <div className="row justify-content-center">
              <div className="col-md-10 col-lg-8 col-xl-6">
                <div className="captureBox">
                  <div className={`screenBox ${darkBack ? "darkBack" : ""}`}>
                    <Webcam
                      audio={false}
                      width={500}
                      height={500}
                      mirrored={currentCam ? false : true}
                      ref={webcamRef}
                      imageSmoothing
                      forceScreenshotSourceSize
                      onUserMedia={userMediaHandler}
                      onUserMediaError={userMediaErrorHandler}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{
                        facingMode: currentCam
                          ? { exact: "environment" }
                          : "user",
                      }}
                    />
                    {data && data.photo_overview ? <div className="OverlayImage">
                      <Image
                        src={data.photo_overview}
                        width={500}
                        height={500}
                        alt=""
                      />
                    </div> : null}
                    {captureAni ? (
                      <div className="captureAnimation">
                        <div className="TimerBox">{count}</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="captureNavs">
                    {devices.length === 2 ? (
                      <button onClick={changeCameraHandler}>
                        {" "}
                        <IoMdReverseCamera /> Reverse
                      </button>
                    ) : (
                      <button onClick={() => setQrModal(true)}>
                        <Image
                          src={swithModalIc}
                          width={40}
                          height={40}
                          alt="Camera Access"
                        />
                        Switch Device
                      </button>
                    )}

                    <button className="captureImg" onClick={capture}>
                      <Image
                        src={cameraIc}
                        width={40}
                        height={40}
                        alt="Camera Access"
                      />
                    </button>
                    <form id="uploadBtnBox" className="uploadBtnBox">
                      <label htmlFor="uploadImage" className="uploadLabelBtn">
                        <Image
                          src={libraryIc}
                          width={40}
                          height={40}
                          alt="Camera Access"
                        />
                        Library
                      </label>
                      <input
                        id="uploadImage"
                        type="file"
                        ref={inputFile}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        className="uploadInput"
                        accept=".png, .jpg, .jpeg"
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="userInterface-content-box" style={{backgroundImage: `url(${eventBg ? eventBg : ''})`}}>
          <RedirectToSevenue />
          <div className="container-fluid uploadPhoto">
            <div className="row justify-content-center">
              <div className="col-md-10 col-lg-8 col-xl-6">
                <div className="uploadBox">
                  <h2>Upload a Photo</h2>
                  <div className="uploadBtnBox">
                    <label htmlFor="uploadImage" className="uploadLabelBtn">
                      Choose A Photo
                    </label>
                    <input
                      id="uploadImage"
                      type="file"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onClick={(event) => {
                        event.target.value = null;
                      }}
                      accept="image/*"
                      className="uploadInput"
                    />
                  </div>
                  <div className="d-flex bottomButtons">
                    <button onClick={() => setQrModal(true)}>
                      Switch Device
                    </button>
                    <form id="uploadBtnBox" className="uploadBtnBox">
                      <label
                        htmlFor="libraryImage"
                        className="uploadLabelBtn libraryImage"
                      >
                        Library
                      </label>
                      <input
                        id="libraryImage"
                        type="file"
                        ref={inputFile}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        className="uploadInput"
                        accept=".png, .jpg, .jpeg"
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CropImage Modal */}
      <Modal
        show={modalShow}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="cropImageModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Adjust Your Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="crop-container">
            <Cropper
              image={imgUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={2 / 2}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
            {saveLoader ? (
              <div className="loaderParent">
                <div className="loader"></div>
              </div>
            ) : null}
          </div>
          <div className="controls">
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e, zoom) => setZoom(zoom)}
              classes={{ root: "slider" }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="rotateButtons">
            <button onClick={() => rotateHandler("left")}>
              <Image
                src={rotateLeftIc}
                width={20}
                height={20}
                alt="Camera Access"
              />
            </button>
            <button onClick={() => rotateHandler("right")}>
            <Image
                src={rotateRightIc}
                width={20}
                height={20}
                alt="Camera Access"
              />
            </button>
          </div>
          <Button
            variant="primary"
            className="submitBtn"
            onClick={showCroppedImage}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Qr code Modal */}
      <Modal
        show={qrModal}
        onHide={() => setQrModal(false)}
        className="qrcodeModal"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="pt-0">
          <div className="qrcodeBox">
            <QRCode value={currentUrl} size={180} />
          </div>
          <h3>Switch Device</h3>
          <p>
            Scan the QR code with your camera to open this page on another
            device.
          </p>
          <button onClick={() => setQrModal(false)}>Dismiss</button>
        </Modal.Body>
      </Modal>

      {/* Camera access Modal */}
      <Modal
        show={cameraAccessModal}
        onHide={() => setCameraAccessModal(false)}
        className="qrcodeModal"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="pt-0">
          <Image
            src={cameraAccess}
            width={120}
            height={120}
            alt="Camera Access"
          />
          <h3>Camera Access</h3>
          <p>
            Sevenue Photobooth needs permission to take photos. Look for your
            browser’s prompt to allow it.
          </p>
          <button onClick={() => setCameraAccessModal(false)}>Dismiss</button>
        </Modal.Body>
      </Modal>
    </EventLogin>
  );
};

export default UploadPhoto;

export async function getServerSideProps(context) {
  const { eventUrl } = context.query;
  const res = await fetch(`${process.env.base_url}api/${eventUrl}`);
  const data = await res.json();
  // Fetch data from external API

  // Pass data to the page via props
  return { props: { data } };
}
