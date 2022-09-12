import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import UserLayout from "../layout/UserLayout";
import Router, { useRouter } from "next/router";

const EventLogin = (props) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { eventUrl } = router.query;

  useEffect(() => {
    if (eventUrl) {
      let cookieName = Cookies.get("name");
      let localName = localStorage.getItem("name");
      let cookieMail = Cookies.get("mail");
      let localMail = localStorage.getItem("mail");

      if (cookieMail !== localMail || cookieName !== localName) {
        document.cookie = "";
        localStorage.clear();
        return Router.push(`/${eventUrl}`);
      } else {
        return setLoading(false);
      }
    }

  }, [eventUrl]);

  return (
    <>
      {loading ? (
        <div className="setLoader">
          <div className="loader"></div>
        </div>
      ) : (
        <UserLayout>
          <section>
            {props.children}
          </section>
        </UserLayout>
      )}
    </>
  );
};

export default EventLogin;
