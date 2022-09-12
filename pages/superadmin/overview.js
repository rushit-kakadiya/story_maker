import Router from 'next/router'
import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { BiInfoCircle } from "react-icons/bi";
import { FaExclamationCircle } from "react-icons/fa";
import SuperAdminLogin from "../../components/SuperAdminLogin/SuperAdminLogin";
import RedirectToSevenue from '../../components/RedirectToSevenue'

const Overview = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      await axios.get(`${window.location.origin}/api/superadmin/events/?overview=overview`)
        .then(res => { setData(res.data); })
        .catch(err => console.log(err))
    }
    fetchEvents();
  }, []);
  return (
    <SuperAdminLogin nav={true}>
      <section className="adminInterface-content-box">
      <RedirectToSevenue />
        <div className="workspace overviewBox">
          {data && <div className="numCards">
            <div className="row">
              <div className="col-md-3">
                <div className="bgCard">
                  <h4>{data.length}</h4>
                  <p>Events</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bgCard">
                  <h4>{data.reduce((i, k) => k.visit + i, 0)}</h4>
                  <p>Visits</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bgCard">
                  <h4>{data.reduce((i, k) => k.total_credit + i, 0)}</h4>
                  <p>Credits</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bgCard">
                  <h4>{data.reduce((i, k) => k.used_credit + i, 0)}</h4>
                  <p>Credits Used</p>
                </div>
              </div>
            </div>
          </div>}
          <div className="boothDetails">
            <div className="row">
              <div className="col-md-9">
                <button className="viewMoreEvent" onClick={() => Router.push("/superadmin/events")}>
                  <FaExclamationCircle />
                  View All
                </button>
              </div>
              <div className="col-md-9">
                <div className="superBgBox">
                  <h6 className="topEvents">Top 10 Events</h6>
                  <Table className="topEventTable">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Event Name</th>
                        <th>Visits</th>
                        <th>Credits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data && data.map((el, i) => {
                        return (
                          <tr key={"events" + i}>
                            <td>{i + 1}</td>
                            <td>
                              {el.event_name}
                            </td>
                            <td>{el.visit}</td>
                            <td>{el.used_credit}/{el.total_credit}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SuperAdminLogin>
  );
};

export default Overview;