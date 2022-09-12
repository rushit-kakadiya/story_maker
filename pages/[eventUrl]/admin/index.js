import { useState } from "react";
import validator from "validator";
import axios from "axios";
import Router, { useRouter } from "next/router";
import EventLayout from "../../../components/layout/EventLayout";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import RedirectToSevenue from '../../../components/RedirectToSevenue'

const Home = () => {
  const router = useRouter();
  const { eventUrl } = router.query;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!validator.isEmail(email) || validator.isEmpty(password)) {
      toast.error("Please fill the value", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    axios
      .post(`${window.location.origin}/api/${eventUrl}/event`, {
        email,
        password,
      })
      .then((res) => {
        Cookies.set('eventadmin_token', res.data)
        localStorage.setItem("eventadmin_token", res.data);
        Router.push(`/${eventUrl}/admin/overview`);
      })
      .catch((err) =>
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      );
  };

  return (
    <EventLayout nav={false}>
      <section className="adminInterface-content-box eventLoginAuth">
      <RedirectToSevenue />
        <div className="container-fluid ">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8 col-xl-6">
              <div className="width-500">
                <h5>Sign In</h5>
                <p className="textAdv">
                  Enter credentials to enter event dashboard
                </p>
                <form className="inputs"  onSubmit={(e) => submit(e)}>
                  <div className="inputBox">
                    <label htmlFor="">Email</label>
                    <input
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                  </div>
                  <div className="inputBox">
                    <label htmlFor="">Password</label>
                    <input
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                  </div>
                  <button type="submit">
                    Login to Dashboard
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </EventLayout>
  );
};

export default Home;
