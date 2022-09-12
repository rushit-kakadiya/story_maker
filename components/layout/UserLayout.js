import axios from "axios";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

const UserLayout = (props) => {
  const [data, setData] = useState(null);
  const router = useRouter();
  const { eventUrl } = router.query;

  useEffect(() => {
    (async () => {
      if (eventUrl) {
        await axios
          .get(`${window.location.origin}/api/${eventUrl}`)
          .then((res) => {
            setData(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })();
  }, [eventUrl]);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {data ? (
          <>
            <title> {data.event_name} | Sevenue Virtual Photo Booth</title>
            <meta
              name="description"
              content={`${data.header} | ${data.sub_header}`}
            ></meta>
          </>
        ) : null}
      </Head>
      <div className="userInterface">
        <header className="user">
          {eventUrl && data ? (
            <button
              className="logo unSqueseLogo"
              onClick={() => Router.push(`/${eventUrl}`)}
            >
              {data.logo ? (
                <Image
                  src={data.logo}
                  alt="Photo Booth"
                  width="250px"
                  height="70px"
                />
              ) : (
                ""
              )}
            </button>
          ) : null}
        </header>
        <main>{props.children}</main>
      </div>
    </>
  );
};

export default UserLayout;
