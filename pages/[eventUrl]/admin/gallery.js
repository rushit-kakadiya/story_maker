import { useEffect, useState } from "react";
import Switch from "react-switch";
import axios from "axios";
import { FaSave } from "react-icons/fa";
import EventAdminLogin from "../../../components/EventAdminLogin/EventAdminLogin";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import RedirectToSevenue from '../../../components/RedirectToSevenue'

const Gallery = () => {
  const router = useRouter();
  const { eventUrl } = router.query;
  const [galleryChecked, setGalleryChecked] = useState(false);
  const [settingLoader, setSettingLoader] = useState(false);

  useEffect(() => {
    fetchGalleryData(eventUrl);
  }, [eventUrl]);

  const fetchGalleryData = async (eventUrl) => {
    await axios
      .get(`${window.location.origin}/api/${eventUrl}/event/gallery`)
      .then((res) => {
        setGalleryChecked(res.data.require_gallery);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const submit = (e) => {
    e.preventDefault();
    setSettingLoader(true);
    axios
      .post(`${window.location.origin}/api/${eventUrl}/event/gallery`, {
        galleryChecked,
      })
      .then((res) => {
        toast.success("Gallery permission saved", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        fetchGalleryData(eventUrl);
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
        <div className="workspace authRequireBox">
          <div className="boothDetails">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="bgBox">
                  <h3>Gallery</h3>
                  <div className="detailsBox pt-0">
                    <div className="authInputBox">
                      <div className="labels">
                        <label htmlFor="">
                          Enable or disable image gallery on the front end.
                        </label>
                      </div>
                      <div className="inputs">
                        <Switch
                          checked={galleryChecked}
                          onChange={() => {
                            setGalleryChecked(!galleryChecked);
                          }}
                          onColor="#dfdfdf"
                          onHandleColor="#4b7ae8"
                          handleDiameter={30}
                          uncheckedIcon={false}
                          checkedIcon={false}
                          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                          height={20}
                          width={48}
                          className="react-switch"
                          id="material-switch"
                        />
                      </div>
                    </div>
                    <button
                      className="blueSaveBtn mt-4"
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

export default Gallery;
