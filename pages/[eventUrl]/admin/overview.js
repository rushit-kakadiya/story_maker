import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaExternalLinkAlt } from "react-icons/fa";
import EventAdminLogin from "../../../components/EventAdminLogin/EventAdminLogin";
import moment from "moment";
import RedirectToSevenue from '../../../components/RedirectToSevenue'

const Overview = () => {
  const router = useRouter();
  const { eventUrl } = router.query;
  const [data, setData] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    setUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (eventUrl) {
      async function fetchData() {
        await axios
          .get(`${window.location.origin}/api/${eventUrl}/event/overview`)
          .then((res) => {
            setData(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      fetchData();
    }
  }, [eventUrl]);

  return (
    <EventAdminLogin nav={true}>
      <section className="adminInterface-content-box">
      <RedirectToSevenue />
        <div className="workspace overviewBox">
          <div className="numCards">
            <div className="row">
              <div className="col-md-3">
                <div className="bgCard">
                  <h4>{data ? data.used_credit : 0}</h4>
                  <p>Credits Used</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bgCard">
                  <h4>{data ? data.total_credit - data.used_credit : 0}</h4>
                  <p>Remaining Credits</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bgCard">
                  <h4>{0}</h4>
                  <p>Emails Collected</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bgCard">
                  <h4>{data ? data.visit : 0}</h4>
                  <p>Total Visits</p>
                </div>
              </div>
            </div>
          </div>
          <div className="boothDetails">
            <div className="row">
              <div className="col-md-9">
                <div className="bgBox">
                  <h3>Photo Booth Details</h3>
                  <div className="detailsBox">
                    <div className="textBox">
                      <h6>Event Name</h6>
                      <p>{data ? data.event_name : ""}</p>
                    </div>
                    <div className="textBox">
                      <h6>Event URL</h6>
                      <Link
                        href={`${url ? `${url}` : ""}/${
                          data ? data.event_url : ""
                        }`}
                        target="_blank"
                      >
                        <a target="_blank">
                          {`${url ? `${url.replace(`https://`, "")}` : ""}/${
                            data ? data.event_url : ""
                          }`}
                          <FaExternalLinkAlt />
                        </a>
                      </Link>
                    </div>
                    <div className="textBox">
                      <h6>Event Start Date</h6>
                      <p>
                        {data
                          ? moment(data.start_date).format("DD MMMM YYYY")
                          : ""}
                      </p>
                    </div>
                    <div className="textBox">
                      <h6>Event End Date</h6>
                      <p>
                        {data
                          ? moment(data.end_date).format("DD MMMM YYYY")
                          : ""}
                      </p>
                    </div>
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

export default Overview;
