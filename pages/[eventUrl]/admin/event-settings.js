import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import validator from "validator";
import { FaSave } from "react-icons/fa";
import { BsUpload } from "react-icons/bs";
import EventAdminLogin from "../../../components/EventAdminLogin/EventAdminLogin";
import { toast } from "react-toastify";
import RedirectToSevenue from '../../../components/RedirectToSevenue'

const EventSettings = () => {
  const router = useRouter();
  const { eventUrl } = router.query;
  const [selectBtn, setSelectBtn] = useState("");
  const [logoImg, setLogoImg] = useState("");
  const [bgImg, setBgImg] = useState("");
  const [bgFile, setBgFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const [eventName, setEventName] = useState("");
  const [hashName, setHashName] = useState("");
  const [themeColor, setThemeColor] = useState("");
  const [header, setHeader] = useState("");
  const [H_fontFamily, setH_FontFamily] = useState("Montserrat");
  const [H_fontColor, setH_FontColor] = useState("");
  const [H_desktopTextSize, setH_DesktopTextSize] = useState("");
  const [H_tabletTextSize, setH_TabletTextSize] = useState("");
  const [H_mobileTextSize, setH_MobileTextSize] = useState("");
  // const [headerFontStyle, setHeaderFontStyle] = useState({});
  const [subHeader, setSubHeader] = useState("");
  const [S_fontFamily, setS_FontFamily] = useState("Montserrat");
  const [S_fontColor, setS_FontColor] = useState("");
  const [S_desktopTextSize, setS_DesktopTextSize] = useState("");
  const [S_tabletTextSize, setS_TabletTextSize] = useState("");
  const [S_mobileTextSize, setS_MobileTextSize] = useState("");
  // const [subHeaderFontStyle, setSubHeaderFontStyle] = useState({});
  const [buttonText, setButtonText] = useState("");
  const [buttonColor, setButtonColor] = useState("");
  const [settingLoader, setSettingLoader] = useState(false);

  useEffect(() => {
    if (eventUrl) {
      fetchData(eventUrl);
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

  const fetchData = async (eventUrl) => {
    await axios
      .get(`${window.location.origin}/api/${eventUrl}/event/setting`)
      .then(async (res) => {
        let El = res.data;
        if (El.event_name) {
          setEventName(El.event_name);
        }
        if (El.hashtag) {
          setHashName(El.hashtag);
        }
        if (El.theme_color) {
          setThemeColor(El.theme_color);
        }
        if (El.header) {
          setHeader(El.header);
        }
        if (El.header_font_style && El.header_font_style.font_family) {
          setH_FontFamily(El.header_font_style.font_family);
        }
        if (El.header_font_style && El.header_font_style.font_color) {
          setH_FontColor(El.header_font_style.font_color);
        }
        if (El.header_font_style && El.header_font_style.text_size_desktop) {
          setH_DesktopTextSize(El.header_font_style.text_size_desktop);
        }
        if (El.header_font_style && El.header_font_style.text_size_tablet) {
          setH_TabletTextSize(El.header_font_style.text_size_tablet);
        }
        if (El.header_font_style && El.header_font_style.text_size_mobile) {
          setH_MobileTextSize(El.header_font_style.text_size_mobile);
        }
        if (El.sub_header) {
          setSubHeader(El.sub_header);
        }
        if (El.sub_header_font_style && El.sub_header_font_style.font_family) {
          setS_FontFamily(El.sub_header_font_style.font_family);
        }
        if (El.sub_header_font_style && El.sub_header_font_style.font_color) {
          setS_FontColor(El.sub_header_font_style.font_color);
        }
        if (El.sub_header_font_style && El.sub_header_font_style.text_size_desktop) {
          setS_DesktopTextSize(El.sub_header_font_style.text_size_desktop);
        }
        if (El.sub_header_font_style && El.sub_header_font_style.text_size_tablet) {
          setS_TabletTextSize(El.sub_header_font_style.text_size_tablet);
        }
        if (El.sub_header_font_style && El.sub_header_font_style.text_size_mobile) {
          setS_MobileTextSize(El.sub_header_font_style.text_size_mobile);
        }
        if (El.button_text) {
          setButtonText(El.button_text);
        }
        if (El.button_style) {
          setSelectBtn(El.button_style);
        }
        if (El.button_color) {
          setButtonColor(El.button_color);
        }
        if (El.background) {
          setBgImg(El.background);
        }
        if (El.logo) {
          setLogoImg(El.logo);
        }
        if (El.logo) {
          setLogoFile(await urlToObject(El.logo));
        }
        if (El.background) {
          setBgFile(await urlToObject(El.background));
        }
 
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = function (ev) {
        setLogoImg(ev.target.result);
        setLogoFile(e.target.files[0]);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleBgChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = function (ev) {
        setBgImg(ev.target.result);
        setBgFile(e.target.files[0]);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const isEmpty = (str) => {
    return (!str || str.length === 0 );
}

  const submit = async () => {
    setSettingLoader(true);
    if (
      isEmpty(eventName) ||
      isEmpty(hashName) ||
      isEmpty(themeColor) ||
      isEmpty(header) ||
      isEmpty(H_fontColor) ||
      isEmpty(H_fontFamily) ||
      isEmpty(H_desktopTextSize) ||
      isEmpty(H_tabletTextSize) ||
      isEmpty(H_mobileTextSize) ||
      isEmpty(subHeader) ||
      isEmpty(S_fontFamily) ||
      isEmpty(S_fontColor) ||
      isEmpty(S_desktopTextSize) ||
      isEmpty(S_tabletTextSize) ||
      isEmpty(S_mobileTextSize) ||
      isEmpty(buttonText) ||
      isEmpty(selectBtn) ||
      isEmpty(buttonColor) ||
      isEmpty(logoImg) ||
      isEmpty(bgImg)
    ) {
      setSettingLoader(false);
      return toast.error("Please fill the values.");
    }
    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("hashtag", hashName);
    formData.append("themeColor", themeColor);
    formData.append("header", header);
    formData.append("h_font_color", H_fontColor);
    formData.append("h_font_family", H_fontFamily);
    formData.append("h_text_size_desktop", H_desktopTextSize);
    formData.append("h_text_size_tablet", H_tabletTextSize);
    formData.append("h_text_size_mobile", H_mobileTextSize);
    formData.append("subHeader", subHeader);
    formData.append("s_font_family", S_fontFamily);
    formData.append("s_font_color", S_fontColor);
    formData.append("s_text_size_desktop", S_desktopTextSize);
    formData.append("s_text_size_tablet", S_tabletTextSize);
    formData.append("s_text_size_mobile", S_mobileTextSize);
    formData.append("buttonText", buttonText);
    formData.append("buttonStyle", selectBtn);
    formData.append("buttonColor", buttonColor);
    formData.append("logo", logoFile);
    formData.append("background", bgFile);
    await axios
      .post(`${window.location.origin}/api/${eventUrl}/event/setting`, formData)
      .then((res) => {
        toast.success("Event settings saved", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        fetchData();
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
        <div className="workspace eventSetBox">
          <div className="boothDetails">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="bgBox">
                  <h3>Splash Screen Settings</h3>
                  <div className="detailsBox">
                    <div className="inputBox">
                      <label className="required">Event Name</label>
                      <input
                        type="text"
                        placeholder="World Day"
                        onChange={(e) => setEventName(e.target.value)}
                        value={eventName}
                      />
                    </div>
                    <div className="inputBox">
                      <label className="required">Event Hashtag</label>
                      <div className="d-flex w-100">
                        <span className="hashtag">#</span>
                        <input
                          type="text"
                          placeholder="HashTag"
                          onChange={(e) => setHashName(e.target.value)}
                          value={hashName}
                        />
                      </div>
                    </div>
                    <div className="inputBox align-items-start">
                      <label className="required">Event Logo</label>
                      <div className="logoUploadBox">
                        <label htmlFor={"logoUpload"} className="button">
                          <BsUpload />
                          Upload your logo
                        </label>
                        <input
                          id={"logoUpload"}
                          type="file"
                          onChange={(e) => handleLogoChange(e)}
                          className="show-for-sr"
                          accept=".png, .jpg, .jpeg"
                        />
                        {logoImg ? (
                          <div className="logo unSqueseLogo">
                            <Image
                              className=""
                              src={logoImg}
                              alt=""
                              width={250}
                              height={70}
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="inputBox">
                      <label className="required">Theme Colour</label>
                      <input
                        type="text"
                        placeholder="#000000"
                        onChange={(e) => setThemeColor(e.target.value)}
                        value={themeColor}
                      />
                    </div>
                    <div className="inputBox">
                      <label className="required">Splash Screen Header</label>
                      <input
                        type="text"
                        placeholder="World Day 2021"
                        onChange={(e) => setHeader(e.target.value)}
                        value={header}
                        maxLength="200"
                      />
                    </div>
                    <div className="inputBox align-items-start">
                      <label>Header Font Style</label>
                      <div className="row subInputs">
                        <div className="col-md-6">
                          <label>Font Family</label>
                          <select
                            name=""
                            id=""
                            onChange={(e) => setH_FontFamily(e.target.value)}
                            value={H_fontFamily}
                          >
                            <option value="Montserrat">Montserrat</option>
                            <option value="Raleway">Raleway</option>
                            <option value="Roboto">Roboto</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label>Font Color</label>
                          <input
                            type="text"
                            placeholder="#000000"
                            onChange={(e) => setH_FontColor(e.target.value)}
                            value={H_fontColor}
                          />
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-4">
                          <label>Text Size (Desktop)</label>
                          <input
                            type="text"
                            placeholder="25px"
                            onChange={(e) =>
                              setH_DesktopTextSize(e.target.value)
                            }
                            value={H_desktopTextSize}
                          />
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-4">
                          <label>Text Size (Tablet)</label>
                          <input
                            type="text"
                            placeholder="20px"
                            onChange={(e) =>
                              setH_TabletTextSize(e.target.value)
                            }
                            value={H_tabletTextSize}
                          />
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-4">
                          <label>Text Size (Mobile)</label>
                          <input
                            type="text"
                            placeholder="15px"
                            onChange={(e) =>
                              setH_MobileTextSize(e.target.value)
                            }
                            value={H_mobileTextSize}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="inputBox align-items-start">
                      <label>Splash Screen Subheader</label>
                      <textarea
                        name=""
                        id=""
                        rows="3"
                        onChange={(e) => setSubHeader(e.target.value)}
                        value={subHeader}
                        maxLength="300"
                        placeholder="Sub header"
                      ></textarea>
                    </div>
                    <div className="inputBox align-items-start">
                      <label>Subheader Font Style</label>
                      <div className="row subInputs">
                        <div className="col-md-6">
                          <label>Font Family</label>
                          <select
                            name=""
                            id=""
                            onChange={(e) => setS_FontFamily(e.target.value)}
                            value={S_fontFamily}
                          >
                            <option value="Montserrat">Montserrat</option>
                            <option value="Raleway">Raleway</option>
                            <option value="Roboto">Roboto</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label>Font Color</label>
                          <input
                            type="text"
                            placeholder="#000000"
                            onChange={(e) => setS_FontColor(e.target.value)}
                            value={S_fontColor}
                          />
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-4">
                          <label>Text Size (Desktop)</label>
                          <input
                            type="text"
                            placeholder="25px"
                            onChange={(e) =>
                              setS_DesktopTextSize(e.target.value)
                            }
                            value={S_desktopTextSize}
                          />
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-4">
                          <label>Text Size (Tablet)</label>
                          <input
                            type="text"
                            placeholder="20px"
                            onChange={(e) =>
                              setS_TabletTextSize(e.target.value)
                            }
                            value={S_tabletTextSize}
                          />
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-4">
                          <label>Text Size (Mobile)</label>
                          <input
                            type="text"
                            placeholder="15px"
                            onChange={(e) =>
                              setS_MobileTextSize(e.target.value)
                            }
                            value={S_mobileTextSize}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="inputBox align-items-start">
                      <label>Photobooth Background</label>
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
                    <div className="inputBox">
                      <label className="required">Button Text</label>
                      <input
                        type="text"
                        placeholder="Let's go!"
                        onChange={(e) => setButtonText(e.target.value)}
                        value={buttonText}
                      />
                    </div>
                    <div className="inputBox align-items-start">
                      <label>Button Style</label>
                      <div className="row selectButton">
                        <div className="col-md-6 col-lg-6 col-xl-4">
                          <div className="borderBox">
                            <div className="radioBox">
                              <input
                                type="radio"
                                name="selectButton"
                                placeholder="World Day"
                                id="squreBtn"
                                checked={selectBtn == "square" ? "checked" : ""}
                              />
                              <label
                                htmlFor="squreBtn"
                                onClick={() => {
                                  setSelectBtn("square");
                                }}
                              >
                                Square
                              </label>
                            </div>
                            <button className="square">Button</button>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-4">
                          <div className="borderBox">
                            <div className="radioBox">
                              <input
                                type="radio"
                                name="selectButton"
                                placeholder="World Day"
                                id="roundedBtn"
                                checked={
                                  selectBtn == "rounded" ? "checked" : ""
                                }
                              />
                              <label
                                htmlFor="roundedBtn"
                                onClick={() => {
                                  setSelectBtn("rounded");
                                }}
                              >
                                Rounded
                              </label>
                            </div>
                            <button className="rounded">Button</button>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-4">
                          <div className="borderBox">
                            <div className="radioBox">
                              <input
                                type="radio"
                                name="selectButton"
                                placeholder="World Day"
                                id="roundBtn"
                                checked={selectBtn == "round" ? "checked" : ""}
                              />
                              <label
                                htmlFor="roundBtn"
                                onClick={() => {
                                  setSelectBtn("round");
                                }}
                              >
                                Round
                              </label>
                            </div>
                            <button className="round">Button</button>
                          </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-xl-4">
                          <label>Button Color</label>
                          <input
                            type="text"
                            placeholder="#000000"
                            onChange={(e) => setButtonColor(e.target.value)}
                            value={buttonColor}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      className="blueSaveBtn"
                      onClick={submit}
                      disabled={settingLoader}
                    >
                      {!settingLoader ? (
                        <>
                          <FaSave />
                          Save Setting
                        </>
                      ) : "Loading..."}
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

export default EventSettings;
