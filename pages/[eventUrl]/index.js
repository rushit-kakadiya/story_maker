import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import Router, { useRouter } from "next/router";
import UserLayout from "../../components/layout/UserLayout";
import { Modal, Button } from "react-bootstrap";
import { BsExclamationCircle } from "react-icons/bs";
import infoBlueIc from "../../public/images/icons/info-blue.svg";
import Cookies from "js-cookie";
import axios from "axios";
import validator from "validator";
import { toast } from "react-toastify";
import Image from "next/image";
import RedirectToSevenue from '../../components/RedirectToSevenue'

const Home = () => {
  const router = useRouter();
  const { eventUrl } = router.query;
  const [data, setData] = useState(null);
  const [authModal, setAuthModal] = useState(false);
  const [name, setName] = useState(false);
  const [email, setEmail] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [winWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    (async () => {
      if (eventUrl) {
        await axios
          .get(`${window.location.origin}/api/${eventUrl}`)
          .then(async (res) => {
            await axios.post(
              `${window.location.origin}/api/${eventUrl}/?visit=${
                res.data.visit + 1
              }`
            );
            setData(res.data);
          })
          .catch((err) => {
            toast.error(err.response.data.message);
          });
      }
    })();
  }, [eventUrl]);

  const setEventHandler = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", setEventHandler);
  }, []);

  useEffect(() => {
    if (data) {
      localStorage.setItem("eventBackground", data.background);
    }
  }, [data]);

  const handleClose = () => {
    setAuthModal(false);
  };

  // if (true) return (<div className="loaderOnPage"><div className="loader">No Data Found</div></div>)
  const authModalHadler = () => {
    if (!data.require_name && !data.require_email) {
      Cookies.set("name", "no name");
      localStorage.setItem("name", "no name");
      Cookies.set("mail", "no email");
      localStorage.setItem("mail", "no email");
      return Router.push(`${eventUrl}/uploadphoto`);
    }
    setName(data.require_name);
    setEmail(data.require_email);
    setAuthModal(data.require_name || data.require_email ? true : false);
  };

  const authSubmitHandler = (e) => {
    e.preventDefault();
    if (data.require_name && !nameValue.trim()) {
      return toast.error("Please enter correct name");
    }
    if (data.require_email && !validator.isEmail(emailValue)) {
      return toast.error("Please enter correct email");
    }
    Cookies.set("name", nameValue);
    localStorage.setItem("name", nameValue);
    Cookies.set("mail", emailValue);
    localStorage.setItem("mail", emailValue);
    return Router.push(`${eventUrl}/uploadphoto`);
  };

  let headerStyle = "";

  if (data) {
    var font_size = "";
    if (winWidth) {
      if (winWidth > 991) {
        font_size = data.header_font_style ? data.header_font_style.text_size_desktop : "25px";
      } else if (winWidth > 575) {
        font_size = data.header_font_style ? data.header_font_style.text_size_tablet : "25px";
      } else if (winWidth <= 575) {
        font_size = data.header_font_style ? data.header_font_style.text_size_mobile : "25px";
      }
    } else {
      font_size = data.header_font_style ? data.header_font_style.text_size_desktop : "25px";
    }
    headerStyle = {
      color: data.header_font_style ? data.header_font_style.font_color : "#000000",
      fontFamily: data.header_font_style ? data.header_font_style.font_family : "Roboto",
      fontSize: font_size,
    };
  }

  let subHeaderStyle = "";
  if (data) {
    var subfont_size = "";
    if (winWidth > 991) {
      subfont_size = data.sub_header_font_style ? data.sub_header_font_style.text_size_desktop : "25px";
    } else if (winWidth > 575) {
      subfont_size = data.sub_header_font_style ? data.sub_header_font_style.text_size_tablet : "25px";
    } else if (winWidth <= 575) {
      subfont_size = data.sub_header_font_style ? data.sub_header_font_style.text_size_mobile : "25px";
    }
    subHeaderStyle = {
      color: data.sub_header_font_style ? data.sub_header_font_style.font_color : "#000000",
      fontFamily: data.sub_header_font_style ? data.sub_header_font_style.font_family : "#000000",
      fontSize: subfont_size,
    };
  }

  return (
    <UserLayout>
      <section
        className="userInterface-content-box"
        style={{ backgroundImage: `url(${data ? data.background : ""})` }}
      >
        <RedirectToSevenue />
        {!data ? (
          <div className="loaderOnPage">
            <div className="loader">No Data Found</div>
          </div>
        ) : (
          <div className="container-fluid ">
            <div className="row justify-content-center splashScreen">
              <div className="col-md-10 col-lg-8 col-xl-7">
                {data ? <h1 style={headerStyle}>{data.header}</h1> : null}

                {data ? (
                  <h2 style={subHeaderStyle}>{data.sub_header}</h2>
                ) : null}

                {data && data.button_text ? (
                  <button
                    className={"letsgo " + data.button_style}
                    onClick={authModalHadler}
                    style={{ color: `${data.button_color}`, backgroundColor: `${data.theme_color ? data.theme_color : "#4b7ae8"}` }}
                  >
                    {data.button_text}
                  </button>
                ) : null}
                <div className="exclamation" style={{ color: `${data.theme_color ? data.theme_color : "#4b7ae8"}`, borderColor: `${data.theme_color ? data.theme_color : "#4b7ae8"}` }}>
                  <div className="warningIcon">
                    <Image src={infoBlueIc} width={40} height={40} alt="" />
                  </div>
                  <p className="ml-2" style={{color: `${data.theme_color ? data.theme_color : "#4b7ae8"}`}}>
                    Your photo will be uploaded to Sevenue Photobooth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Modal
          show={authModal}
          onHide={handleClose}
          centered={true}
          className="userAuthModal"
        >
          <Modal.Body>
            <div className="imgPreview">
              <div className="textBox">
                <h6>Please enter your name and email below to proceed.</h6>
                <form className="inputs" onSubmit={(e) => authSubmitHandler(e)}>
                  {name && (
                    <div className="inputBox">
                      <label htmlFor="">Name</label>
                      <input
                        type="text"
                        onChange={(e) => {
                          setNameValue(e.target.value);
                        }}
                        value={nameValue}
                      />
                    </div>
                  )}
                  {email && (
                    <div className="inputBox">
                      <label htmlFor="">Email</label>
                      <input
                        type="text"
                        onChange={(e) => {
                          setEmailValue(e.target.value);
                        }}
                        value={emailValue}
                      />
                    </div>
                  )}
                  {/* {error ? <p className="error">Please enter correct values</p> : null} */}
                  <button type="submit">Continue</button>
                </form>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </section>
    </UserLayout>
  );
};

export default Home;
