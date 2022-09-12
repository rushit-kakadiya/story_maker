import { useEffect, useState } from "react";
import EventLogin from "../../components/EventLogin/EventLogin";
import Image from "next/image";
import Link from "next/link";
import { Modal, Button } from "react-bootstrap";
import Router, { useRouter } from "next/router";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { saveAs } from "file-saver";
import RedirectToSevenue from '../../components/RedirectToSevenue'

import { FaShareSquare, FaImages, FaHome } from "react-icons/fa";

import insta_ic from "../../public/images/insta_ic.svg";
import fb_ic from "../../public/images/facebook_ic.svg";
import twitter_ic from "../../public/images/twitter_ic.svg";
import copy_ic from "../../public/images/link_ic.svg";
import down_ic from "../../public/images/download_ic.svg";
import homeIc from "../../public/images/icons/Home_white.svg";

const FinishImage = ({ data, hashtag, galleryToggle }) => {
  const router = useRouter();
  const { eventUrl } = router.query;
  const [finishimage, setFinishimage] = useState(
    data.getData[data.count - 1].image
  );
  const [gallery, setGallery] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [copy, setCopy] = useState(false);
  const [hashTag, setHashTag] = useState(hashtag);
  const [eventBg, setEventBg] = useState(null);

  useEffect(() => {
    setEventBg(localStorage.getItem("eventBackground"));
  }, []);

  useEffect(() => {
    const getImage = localStorage.getItem("FinishImage");
    if (!getImage) {
      return Router.push(`/${eventUrl}`);
    }
    setFinishimage(getImage);
  }, [eventUrl]);

  const shareModalHandler = () => {
    setShareModal(true);
  };

  const handleClose = () => {
    setShareModal(false);
    setGallery(true);
  };

  const download = () => {
    saveAs(finishimage, "image.jpg");
  };

  const InstaHandler = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "A Narwhal",
          text: "This is a narwhal",
          url: finishimage,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing"));
    } else {
      console.log("navigator.share not available");
    }
  };

  return (
    <EventLogin>
      <section
        className="userInterface-content-box"
        style={{ backgroundImage: `url(${eventBg ? eventBg : ""})` }}
      >
        <RedirectToSevenue />
        <div className="container-fluid ">
          <div className="row justify-content-center editImageScreen">
            <div className="col-md-10 col-lg-8 col-xl-6">
              <div className="editImageBox">
                {finishimage ? (
                  <Image
                    src={finishimage}
                    width={450}
                    height={450}
                    alt=""
                    className="finalImage"
                  />
                ) : (
                  <div className="loader">Loader</div>
                )}
              </div>
              <div className="nextPrevBtns">
                {gallery ? (
                  <>
                    <Link href={`/${eventUrl}`} passHref={true}>
                      <button>
                        <div className="postIcon">
                          <Image
                            src={homeIc}
                            width={30}
                            height={30}
                            alt="Camera Access"
                          />
                        </div>{" "}
                        Home
                      </button>
                    </Link>
                    {galleryToggle ? (
                      <Link href={`/${eventUrl}/gallery`} passHref={true}>
                        <button>
                          <FaImages />
                          <br /> Gallery
                        </button>
                      </Link>
                    ) : null}
                  </>
                ) : (
                  ""
                )}

                <button onClick={shareModalHandler}>
                  <FaShareSquare />
                  <br /> Share
                </button>
              </div>
            </div>
          </div>
        </div>
        <Modal
          show={shareModal}
          onHide={handleClose}
          className="socialShareModal"
        >
          <Modal.Body>
            <div className="socialIcons">
              <div className="bgBox">
                <button onClick={() => InstaHandler()}>
                  <Image src={insta_ic} width={60} height={60} alt="" /> <br />
                  Instagram
                </button>
              </div>
              <div className="bgBox">
                <button
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer.php?u=${window.location.origin}?imageurl=${finishimage}`,
                      "_blank"
                    )
                  }
                >
                  <Image src={fb_ic} width={60} height={60} alt="" /> <br />
                  Facebook
                </button>
              </div>
              <div className="bgBox">
                <button
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${finishimage}`,
                      "_blank"
                    )
                  }
                >
                  <Image src={twitter_ic} width={60} height={60} alt="" />{" "}
                  <br />
                  Twitter
                </button>
              </div>
              <div className="bgBox">
                <CopyToClipboard
                  onCopy={() => setCopy(true)}
                  text={finishimage}
                >
                  <button>
                    <Image src={copy_ic} width={60} height={60} alt="" /> <br />
                    Copy Link
                  </button>
                </CopyToClipboard>
              </div>
              <div className="bgBox">
                <button onClick={() => download()}>
                  <Image src={down_ic} width={60} height={60} alt="" /> <br />
                  Download
                </button>
              </div>
            </div>
            {hashTag ? <p className="hashTagAdd">#{hashTag}</p> : null}
          </Modal.Body>
        </Modal>
      </section>
    </EventLogin>
  );
};

export default FinishImage;

export async function getServerSideProps(context) {
  const { eventUrl } = context.query;
  // Fetch data from external API
  const res = await fetch(`${process.env.base_url}/api/${eventUrl}/allEntries`);
  const resEventData = await fetch(`${process.env.base_url}/api/${eventUrl}`);
  const data = await res.json();
  const resEvent = await resEventData.json();
  // Pass data to the page via props
  return {
    props: {
      data,
      hashtag: resEvent.hashtag ? resEvent.hashtag : null,
      galleryToggle: resEvent.require_gallery ? resEvent.require_gallery : null,
    },
  };
}
