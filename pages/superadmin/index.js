import axios from "axios";
import Router from "next/router";
import { useState, useEffect } from "react";
import validator from "validator";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import SuperLayout from "../../components/layout/SuperLayout";
import RedirectToSevenue from '../../components/RedirectToSevenue'

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let cookieAdminData = Cookies.get('superadmin_token');
    let adminData = localStorage.getItem('superadmin_token');

    if (adminData && cookieAdminData && adminData === cookieAdminData) {
      return Router.push(`/superadmin/overview`);
    } else {
      document.cookie = "";
      localStorage.clear();
      return Router.push(`/superadmin`);
    }
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!validator.isEmail(email) || validator.isEmpty(password)) {
      toast.error("Please fill the values.", {
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
      .post(`${window.location.origin}/api/superadmin`, { email, password })
      .then((res) => {
        Cookies.set("superadmin_token", res.data);
        localStorage.setItem("superadmin_token", res.data);
        Router.push("/superadmin/overview");
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
      });
  };

  return (
    <SuperLayout nav={false}>
      <section className="adminInterface-content-box eventLoginAuth">
      <RedirectToSevenue />
        <div className="container-fluid ">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8 col-xl-6">
              <div className="width-500">
                <h5>Sign In</h5>
                <p className="textAdv">
                  Enter credentials to enter admin dashboard
                </p>
                <form className="inputs" onSubmit={(e) => submit(e)}>
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
                  <button type="submit">Login to Admin</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SuperLayout>
  );
};

export default Home;
