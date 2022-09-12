import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Switch from "react-switch";
import { FaSave } from "react-icons/fa";
import EventAdminLogin from "../../../components/EventAdminLogin/EventAdminLogin";
import { toast } from "react-toastify";
import RedirectToSevenue from '../../../components/RedirectToSevenue'

const Authentication = () => {
  const router = useRouter();
  const { eventUrl } = router.query;
  const [nameChecked, setNameChecked] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [settingLoader, setSettingLoader] = useState(false);

  useEffect(() => {
    fetchAuth(eventUrl);
  }, [eventUrl]);

  const fetchAuth = async (eventUrl) => {
    await axios
      .get(`${window.location.origin}/api/${eventUrl}/event/authentication`)
      .then((res) => {
        setNameChecked(res.data.require_name);
        setEmailChecked(res.data.require_email);
      })
      .catch((err) => console.log(err));
  };

  const submit = (e) => {
    e.preventDefault();
    setSettingLoader(true);
    axios
      .post(`${window.location.origin}/api/${eventUrl}/event/authentication`, {
        requireName: nameChecked,
        requireEmail: emailChecked,
      })
      .then((res) => {
        toast.success("Authentications saved", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        fetchAuth(eventUrl);
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
        })
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
                  <h3>Authentication</h3>
                  <div className="detailsBox pt-0">
                    <p className="authSubTitle">
                      Require participants to enter their name or email address
                      to join this event.
                    </p>
                    <div className="authInputBox">
                      <div className="labels">
                        <label htmlFor="">Require name</label>
                        <p>
                          Participants need to enter their names to join your
                          event.
                        </p>
                      </div>
                      <div className="inputs">
                        <Switch
                          checked={nameChecked}
                          onChange={() => {
                            setNameChecked(!nameChecked);
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
                          id="nameSwitch"
                        />
                      </div>
                    </div>
                    <div className="authInputBox">
                      <div className="labels">
                        <label htmlFor="">Require email address</label>
                        <p>
                          Participants will be asked to enter their email
                          address before joining.
                        </p>
                      </div>
                      <div className="inputs">
                        <Switch
                          checked={emailChecked}
                          onChange={() => {
                            setEmailChecked(!emailChecked);
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
                          id="emailSwitch"
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

export default Authentication;
