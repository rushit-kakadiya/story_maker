import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import Cookies from 'js-cookie';
import event_logo from "../../public/images/sevenue.svg";
import { AiOutlineMenu } from "react-icons/ai";
import {
  FaEye,
  FaBars,
  FaCog,
  FaImages,
  FaAddressCard,
  FaExclamationCircle,
  FaFileSignature,
  FaCameraRetro,
} from "react-icons/fa";

const SuperLayout = (props) => {
  const [asideActive, setAsideActive] = useState(false);
  const router = useRouter();
  const logoutHandler = () => {
    document.cookie = "";
    localStorage.clear();
    return Router.push(`/superadmin`);
  };
  return (
    <div className="eventInterface">
      <header className="event">
        <Image
          className="logo"
          src={event_logo}
          alt=""
          width={150}
          height={42}
        />
        {props.nav ? (
          <div className="eventNavs">
            <button onClick={logoutHandler}>Log Out</button>
          </div>
        ) : (
          ""
        )}
        {props.nav ? (
          <button
            className="menuButton"
            onClick={() => setAsideActive(!asideActive)}
          >
            <AiOutlineMenu />
          </button>
        ) : (
          ""
        )}
      </header>
      <div className="mainWrapper">
        {props.nav ? (
          <aside className={asideActive ? "active" : ""}>
            <ul>
              <li
                className={
                  router.asPath == "/superadmin/overview" ? "active" : ""
                }
              >
                <Link href="/superadmin/overview" className="" passHref={true}>
                  <span>
                    <FaExclamationCircle /> Overview
                  </span>
                </Link>
              </li>
              <li
                className={
                  router.asPath == "/superadmin/events" ? "active" : ""
                }
              >
                <Link href="/superadmin/events" className="" passHref={true}>
                  <span>
                    <FaCog /> Events
                  </span>
                </Link>
              </li>
            </ul>
          </aside>
        ) : (
          ""
        )}
        <main className={props.nav ? "withNavs" : ""}>{props.children}</main>
      </div>
    </div>
  );
};

export default SuperLayout;
