import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Router, { useRouter } from "next/router";
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

const EventLayout = (props) => {
  const [asideActive, setAsideActive] = useState(false);
  const router = useRouter();
  const { eventUrl } = router.query;
  const logoutHandler = () => {
    document.cookie = "";
    localStorage.clear();
    return Router.push(`/${eventUrl}/admin`);
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
            {eventUrl ? <Link href={`/${eventUrl}`} target="_blank">
              <a target="_blank">
                <button className="blue">
                <FaEye /> View PhotoBooth
                </button>
              </a>
            </Link> : null}
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
                  router.asPath == `/${router.query.eventUrl}/admin/overview`
                    ? "active"
                    : ""
                }
              >
                <Link
                  href={`/${router.query.eventUrl}/admin/overview`}
                  className=""
                  passHref={true}
                >
                  <span>
                    <FaExclamationCircle /> Overview
                  </span>
                </Link>
              </li>
              <li
                className={
                  router.asPath ==
                  `/${router.query.eventUrl}/admin/event-settings`
                    ? "active"
                    : ""
                }
              >
                <Link
                  href={`/${router.query.eventUrl}/admin/event-settings`}
                  className=""
                  passHref={true}
                >
                  <span>
                    <FaCog /> Event Settings
                  </span>
                </Link>
              </li>
              <li
                className={
                  router.asPath ==
                  `/${router.query.eventUrl}/admin/booth-assets`
                    ? "active"
                    : ""
                }
              >
                <Link
                  href={`/${router.query.eventUrl}/admin/booth-assets`}
                  className=""
                  passHref={true}
                >
                  <span>
                    <FaImages /> Booth Assets
                  </span>
                </Link>
              </li>
              <li
                className={
                  router.asPath ==
                  `/${router.query.eventUrl}/admin/authentication`
                    ? "active"
                    : ""
                }
              >
                <Link
                  href={`/${router.query.eventUrl}/admin/authentication`}
                  className=""
                  passHref={true}
                >
                  <span>
                    <FaAddressCard />
                    Authentication
                  </span>
                </Link>
              </li>
              <li
                className={
                  router.asPath == `/${router.query.eventUrl}/admin/entries`
                    ? "active"
                    : ""
                }
              >
                <Link
                  href={`/${router.query.eventUrl}/admin/entries`}
                  className=""
                  passHref={true}
                >
                  <span>
                    <FaFileSignature />
                    Entries
                  </span>
                </Link>
              </li>
              <li
                className={
                  router.asPath == `/${router.query.eventUrl}/admin/gallery`
                    ? "active"
                    : ""
                }
              >
                <Link
                  href={`/${router.query.eventUrl}/admin/gallery`}
                  className=""
                  passHref={true}
                >
                  <span>
                    <FaCameraRetro />
                    Gallery
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

export default EventLayout;
