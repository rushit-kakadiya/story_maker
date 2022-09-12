import { useState, useEffect, useCallback, useMemo } from "react";
import validator from "validator";
import Link from "next/link";
import DataTable from "react-data-table-component";
import axios from "axios";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import {
  FaTrash,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaPen,
  FaPlus,
} from "react-icons/fa";
import CustomPagination from "../../components/pagination/CustomPagination";
import { TiExportOutline } from "react-icons/ti";
import SuperAdminLogin from "../../components/SuperAdminLogin/SuperAdminLogin";
import "react-data-table-component-extensions/dist/index.css";
import Cookies from "js-cookie";
import Router from "next/router";
import RedirectToSevenue from '../../components/RedirectToSevenue'

const Events = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteEventModal, setdeleteEventModal] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [editEvent, setEditEvent] = useState(false);
  const [editEventData, setEditEventData] = useState(null);
  const [createEvent, setCreateEvent] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [createEventData, setCreateEventData] = useState({
    admin_email: "",
    admin_name: "",
    admin_password: "",
    end_date: moment(new Date()).format(
      "YYYY-MM-DD"
    ),
    event_name: "",
    visit: 0,
    used_credit: 0,
    event_url: "",
    start_date: moment(new Date()).format(
      "YYYY-MM-DD"
    ),
    total_credit: 0,
  });
  const [exportData, setExportData] = useState(null);
  const [activeEventState, setActiveEventState] = useState("all");
  const [activeCount, setActiveCount] = useState(0);
  const [endedCount, setEndedCount] = useState(0);
  const [error, setError] = useState(null)
  const [createLoader, setCreateLoader] = useState(false)
  const [editLoader, setEditLoader] = useState(false)

  const fetchUsers = useCallback(async (page, perPage, eventType = null) => {
    setLoading(true);
    let response;
    if(eventType){
      response = await axios.get(
        `${window.location.origin}/api/superadmin/events/?perPage=${perPage}&page=${page}&eventType=${eventType}`
      );
    } else {
      response = await axios.get(
        `${window.location.origin}/api/superadmin/events/?perPage=${perPage}&page=${page}`
      );
    }

    setData(
      response.data.getData.map((el, i) => {
        return {
          ...el,
          id: `${i + 1}`,
          start_date: `${moment(el.start_date).format("DD/MM/YYYY")}`,
          end_date: `${moment(el.end_date).format("DD/MM/YYYY")}`,
          credits: `${el.used_credit}/${el.total_credit}`,
          view: (
            // <button className="changeBtn" key={"view" + i}>
            //   <FaExternalLinkAlt />
            //   View
            // </button>
            <Link href={`../${el.event_url}`} target="_blank" key={"view" + i}>
              <a target="_blank">
                <button className="changeBtn">
                  <FaExternalLinkAlt />
                  View
                </button>
              </a>
            </Link>
          ),
          edit: (
            <button
              className="changeBtn"
              key={"edit_event" + i}
              onClick={() => editEventHandler(el)}
            >
              <FaPen />
              Edit
            </button>
          ),
          edit_event: (
            <button
              className="changeBtn"
              key={"edit" + i}
              onClick={() => editHandler(el)}
            >
              <FaPen />
              Edit Event
            </button>
          ),
          delete: (
            <button
              key={"delete" + i}
              className="changeBtn"
              onClick={() => shareModalHandler(el)}
            >
              <FaTrash />
              Delete
            </button>
          ),
        };
      })
    );

    const all_data = await axios.get(
      `${window.location.origin}/api/superadmin/events`
    );
    setExportData(
      all_data.data.getData.map((el, i) => {
        return {
          id: `${i + 1}`,
          event_name: `${el.event_name}`,
          admin_name: `${el.admin_name}`,
          admin_email: `${el.admin_email}`,
          event_url: `${el.event_url}`,
          start_date: `${moment(el.start_date).format("DD/MM/YYYY")}`,
          end_date: `${moment(el.end_date).format("DD/MM/YYYY")}`,
          visit: `${el.visit}`,
          credits: `${el.used_credit}/${el.total_credit}`,
          view: `${el.view}`,
        };
      })
    );
    setActiveCount(response.data.activeCount);
    setEndedCount(response.data.endedCount);
    setTotalRows(response.data.count);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers(currentPage, perPage);
  }, [fetchUsers, currentPage, perPage]);

  const handleDelete = async (row) => {
    await axios
      .delete(`${window.location.origin}/api/superadmin/delete/?id=${row._id}`)
      .then((res) =>
        toast.success("Event has been deleted", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      )
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
    setdeleteEventModal(false);
    setCurrentRow(null);
    fetchUsers(currentPage, perPage);
  };

  const handlePageChange = (page) => {
    fetchUsers(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchUsers(page, newPerPage);
    setPerPage(newPerPage);
  };

  const shareModalHandler = (data) => {
    setCurrentRow(data);
    setdeleteEventModal(true);
  };

  const handleClose = () => {
    setdeleteEventModal(false);
    setCurrentRow(null);
  };

  const editEventHandler = (data) => {
    setEditEvent(true);
    setEditEventData({ ...data, ["admin_password"]: "" });
  };

  const eventDataUpdateHandler = async () => {
    setEditLoader(true)
    if (
      validator.isEmpty(editEventData.event_name) ||
      validator.isEmpty(editEventData.event_url) ||
      !(editEventData.total_credit > 0) ||
      validator.isEmpty(editEventData.admin_name) ||
      !validator.isEmail(editEventData.admin_email)
    ) {
      toast.error("Please fill the values.");
      setEditLoader(false)
      return;
    }
    
    if(editEventData.admin_password){
      if (!validator.isStrongPassword(editEventData.admin_password, { minLength: 14, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        toast.error("Invalid Password.");
        setEditLoader(false)
        return;
      }
    }

    if (editEventData.start_date > editEventData.end_date) {
      setEditLoader(false);
      return toast.error("Invalid Date");
    }

    await axios
      .post(`${window.location.origin}/api/superadmin/update`, editEventData)
      .then((res) => {
        toast.success("Event has been updated", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setEditLoader(false)
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
        setEditLoader(false)
      });
    fetchUsers(currentPage, perPage);
    setEditEvent(false);
  };

  const editEventChangeHandler = (e) => {
    setEditEventData({
      ...editEventData,
      [e.target.name]: e.target.value,
    });
  };

  const editHandler = (data) => {
    Cookies.set(
      "eventadmin_token",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjEyMzQ1NiIsImlhdCI6MTYzNDE4NjQwMCwiZXhwIjoxNjM0MjcyODAwfQ.z4Q3zNqutNDzIk-Lt4--BfwfrIgvanL_VxIDjxOzGoQ"
    );
    localStorage.setItem(
      "eventadmin_token",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjEyMzQ1NiIsImlhdCI6MTYzNDE4NjQwMCwiZXhwIjoxNjM0MjcyODAwfQ.z4Q3zNqutNDzIk-Lt4--BfwfrIgvanL_VxIDjxOzGoQ"
    );
    Router.push(`/${data.event_url}/admin/event-settings`);
  };

  const dataUpdateHandler = async () => {
    setEditLoader(true)
    if (
      validator.isEmpty(editData.event_name) ||
      validator.isEmpty(editData.event_url) ||
      !(editData.total_credit > 0) ||
      validator.isEmpty(editData.admin_name) ||
      !validator.isEmail(editData.admin_email) ||
      validator.isEmpty(editData.admin_password)
    ) {
      setEditLoader(false)
      toast.error("Please fill the values.");
      return;
    }

    if (editData.start_date > editData.end_date) {
      setEditLoader(false);
      return toast.error("Invalid Date");
      }

    await axios
      .post(`${window.location.origin}/api/superadmin/update`, editData)
      .then((res) => {
        toast.success("Event has been updated", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setEditLoader(false);
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
        setEditLoader(false);
      });
    fetchUsers(currentPage, perPage);
    setEdit(false);
  };

  const editChangeHandler = (e) => {
    setEditData({
      ...editEventData,
      [e.target.name]: e.target.value,
    });
  };

  const eventDataCreateHandler = async () => {
    setCreateLoader(true);
    if (
      validator.isEmpty(createEventData.event_name) ||
      validator.isEmpty(createEventData.event_url) ||
      !(createEventData.total_credit > 0)  ||
      validator.isEmpty(createEventData.admin_name) ||
      !validator.isEmail(createEventData.admin_email) ||
      validator.isEmpty(createEventData.admin_password)
    ) {
      setCreateLoader(false)
      toast.error("Please fill the values.");
      return;
    }

    if (!validator.isStrongPassword(createEventData.admin_password, { minLength: 14, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
      toast.error("Invalid Password.");
      setCreateLoader(false)
      return;
    }

    if (createEventData.start_date > createEventData.end_date) {
      setCreateLoader(false);
      return toast.error("Invalid Date");
    }

    await axios
      .post(`${window.location.origin}/api/superadmin/create`, createEventData)
      .then((res) => {
        toast.success("Event has been created", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setCreateEvent(false);
        setCreateEventData({
          admin_email: "",
          admin_name: "",
          admin_password: "",
          end_date: moment(new Date()).format(
            "YYYY-MM-DD"
          ),
          event_name: "",
          visit: 0,
          used_credit: 0,
          event_url: "",
          start_date: moment(new Date()).format(
            "YYYY-MM-DD"
          ),
          total_credit: 0,
        });
        setCreateLoader(false)
      })
      .catch((err) => {
        if(err.response.data.message == "Event already exist."){
          setError(err.response.data.message);
        }
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setCreateLoader(false)
      });
    fetchUsers(currentPage, perPage);
    setEditEvent(false);
  };

  const createEventChangeHandler = (e) => {
    setError(false);
    setCreateEventData({
      ...createEventData,
      [e.target.name]: e.target.value,
    });
  };

  const columns = useMemo(
    () => [
      {
        name: "No.",
        selector: "id",
        sortable: true,
      },
      {
        name: "Event Name",
        selector: "event_name",
        sortable: true,
      },
      {
        name: "Admin Name",
        selector: "admin_name",
        sortable: true,
      },
      {
        name: "Admin Email",
        selector: "admin_email",
        sortable: true,
      },
      {
        name: "Event URL",
        selector: "event_url",
        sortable: true,
      },
      {
        name: "Start Date",
        selector: "start_date",
        sortable: true,
      },
      {
        name: "End Date",
        selector: "end_date",
        sortable: true,
      },
      {
        name: "Visits",
        selector: "visit",
        sortable: true,
      },
      {
        name: "Credits",
        selector: "credits",
        sortable: true,
      },
      {
        selector: "view",
      },
      {
        selector: "edit",
      },
      {
        selector: "edit_event",
      },
      {
        selector: "delete",
      },
    ],
    []
  );

  const tableData = {
    columns,
    data,
    print: false,
    export: false,
  };

  const conditionalRowStyles = [
    {
      when: (row) => row,
      style: {
        borderColor: "#dedede",
        color: "#000000",
        padding: "10px 0px",
      },
    },
  ];

  /* CSV Header */
  const headers = [
    { label: "Id", key: "id" },
    { label: "Event Name", key: "event_name" },
    { label: "Admin Name", key: "admin_name" },
    { label: "Admin Email", key: "admin_email" },
    { label: "Event URL", key: "event_url" },
    { label: "Start Date", key: "start_date" },
    { label: "End Date", key: "end_date" },
    { label: "Visits", key: "visit" },
    { label: "Credits", key: "credits" },
  ];

  const eventFilterHandler = (filter) => {
    if (filter === 'all') {
      fetchUsers(currentPage, perPage)
    } else if (filter === 'active'){
      fetchUsers(currentPage, perPage, "active");
    } else if (filter === 'ended') {
      fetchUsers(currentPage, perPage, "ended");
    }
    setActiveEventState(filter)
  }

  return (
    <SuperAdminLogin nav={true}>
      <section className="adminInterface-content-box">
      <RedirectToSevenue />
        <div className="workspace entriesBox">
          <div className="boothDetails">
            <div className="row justify-content-center">
              {!createEvent && !editEvent ? (
                <div className="col-md-12">
                  {exportData ? (
                    <div className="dataTableBtnGroup mt-4 mb-3">
                      <div className="mr-auto EventsFilters">
                        <h6>List of Events</h6>
                        <div className="filterButtons">
                          <button className={`pl-0 ${activeEventState == 'all' ? 'active' : ''}`} onClick={() => eventFilterHandler("all")}>All({totalRows})</button>
                          <button className={`${activeEventState == 'active' ? 'active' : ''}`} onClick={() => eventFilterHandler("active")}>Active({activeCount})</button>
                          <button className={`${activeEventState == 'ended' ? 'active' : ''}`} onClick={() => eventFilterHandler("ended")}>Ended({endedCount})</button>
                        </div>
                      </div>
                      <button className="dataTableBlueBtn">
                        <CSVLink data={exportData} headers={headers}>
                          <TiExportOutline />
                          Export
                        </CSVLink>
                      </button>
                      <button
                        className="createBtn"
                        onClick={() => setCreateEvent(true)}
                      >
                        <FaPlus />
                        Create
                      </button>
                    </div>
                  ) : null}
                  <div className="bgBox">
                    <div className="detailsBox pt-0">
                      <div className="imgDetailsTable editdataTable">
                        <DataTable
                          className="Users"
                          columns={columns}
                          data={data}
                          progressPending={loading}
                          conditionalRowStyles={conditionalRowStyles}
                          pagination
                          paginationServer
                          paginationTotalRows={totalRows}
                          paginationDefaultPage={currentPage}
                          onRowsPerPageChange={handlePerRowsChange}
                          onPageChange={handlePageChange}
                          paginationComponent={CustomPagination}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {edit && editData ? (
                <div className="col-md-10">
                  <div className="bgBox">
                    <h3>Edit Event</h3>
                    <div className="detailsBox">
                      <div className="inputBox">
                        <label className="required">Event Name</label>
                        <input
                          type="text"
                          name="event_name"
                          value={editData.event_name}
                          onChange={(e) => editChangeHandler(e)}
                        />
                      </div>
                      <div className="inputBox">
                        <label className="required">Admin Name</label>
                        <input
                          type="text"
                          name="admin_name"
                          value={editData.admin_name}
                          onChange={(e) => editChangeHandler(e)}
                        />
                      </div>
                      <div className="editBox">
                        <button
                          className="blueSaveBtn"
                          onClick={() => dataUpdateHandler()}
                        >
                          Save
                        </button>
                        <button
                          className="blueBorderBtn"
                          onClick={() => {
                            setEdit(false);
                            setEditData(null);
                          }}
                        >
                          Exit Without Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {editEvent && editEventData ? (
                <div className="col-md-10">
                  <div className="bgBox">
                    <h3>Edit Event</h3>
                    <div className="detailsBox">
                      <div className="inputBox">
                        <label className="required">Event Name</label>
                        <input
                          type="text"
                          name="event_name"
                          value={editEventData.event_name}
                          onChange={(e) => editEventChangeHandler(e)}
                        />
                      </div>
                      <div className="inputBox">
                        <label className="required">Event URL</label>
                        <p className="m-0 d-flex w-100 align-items-center">
                          photobooth.sevenue.io/
                          <input
                            className="ml-2"
                            type="text"
                            name="event_url"
                            value={editEventData.event_url}
                            onChange={(e) => editEventChangeHandler(e)}
                          />
                        </p>
                      </div>
                      <div className="inputBox">
                        <label className="required">Credits</label>
                        <input
                          type="text"
                          name="total_credit"
                          value={editEventData.total_credit}
                          onChange={(e) => editEventChangeHandler(e)}
                        />
                      </div>
                      <div className="inputBox">
                        <label className="required">Admin Name</label>
                        <input
                          type="text"
                          name="admin_name"
                          value={editEventData.admin_name}
                          onChange={(e) => editEventChangeHandler(e)}
                        />
                      </div>
                      <div className="inputBox">
                        <label className="required">Event Admin Email</label>
                        <input
                        disabled
                          type="email"
                          name="admin_email"
                          value={editEventData.admin_email}
                        />
                      </div>
                      <div className="inputBox">
                        <label className="required">Admin password</label>
                        <input
                          type="password"
                          name="admin_password"
                          value={editEventData.admin_password}
                          onChange={(e) => editEventChangeHandler(e)}
                        />
                      </div>
                      <div className="inputBox">
                        <label className="required">Event Start Date</label>
                        <input
                          type="date"
                          name="start_date"
                          value={moment(editEventData.start_date).format(
                            "YYYY-MM-DD"
                          )}
                          onChange={(e) => editEventChangeHandler(e)}
                        />
                      </div>
                      <div className="inputBox">
                        <label className="required">Event End Date</label>
                        <input
                          type="date"
                          name="end_date"
                          value={moment(editEventData.end_date).format(
                            "YYYY-MM-DD"
                          )}
                          onChange={(e) => editEventChangeHandler(e)}
                        />
                      </div>
                      <div className="editBox">
                        <button
                          className="blueSaveBtn"
                          onClick={() => eventDataUpdateHandler()}
                          disabled={editLoader}
                        >
                          {editLoader ? "Loading..." : "Save"}
                        </button>
                        <button
                          className="blueBorderBtn"
                          onClick={() => {
                            setEditEvent(false);
                            setEditEventData(null);
                          }}
                        >
                          Exit Without Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {createEvent ? (
                <div className="col-md-10">
                  <div className="bgBox">
                    <h3>Create Event</h3>
                    <div className="detailsBox">
                      <div className="inputBox">
                        <label className="required">Event Name</label>
                        <input
                          type="text"
                          name="event_name"
                          value={createEventData.event_name}
                          onChange={(e) => createEventChangeHandler(e)}
                        />
                      </div>
                      <div className="inputBox">
                        <label className="required">Event URL</label>
                        <p className="m-0 d-flex w-100 align-items-center">
                          photobooth.sevenue.io/
                          <input
                            className="ml-2"
                            name="event_url"
                            type="text"
                            value={createEventData.event_url}
                            onChange={(e) => createEventChangeHandler(e)}
                          />
                        </p>
                      </div>
                      {error ? <p className="eventErrorMsg">{error}</p> : null}
                      <div className="inputBox">
                        <label className="required">Credits</label>
                        <input
                          type="text"
                          name="total_credit"
                          value={createEventData.total_credit}
                          onChange={(e) => createEventChangeHandler(e)}
                        />
                      </div>
                      <div className="inputBox">
                        <label className="required">Admin Name</label>
                        <input
                          type="text"
                          name="admin_name"
                          value={createEventData.admin_name}
                          onChange={(e) => createEventChangeHandler(e)}
                        />
                      </div>
                      <div className="inputBox">
                        <label className="required">Event Admin Email</label>
                        <input
                          type="email"
                          name="admin_email"
                          value={createEventData.admin_email}
                          onChange={(e) => createEventChangeHandler(e)}
                        />
                      </div>
                      <div className="inputBox">
                        <label className="required">Admin password</label>
                        <input
                          type="password"
                          name="admin_password"
                          value={createEventData.admin_password}
                          onChange={(e) => createEventChangeHandler(e)}
                        />
                      </div>
                      <div className="inputBox">
                        <label className="required">Event Start Date</label>
                        <input
                          type="date"
                          name="start_date"
                          value={moment(createEventData.start_date).format(
                            "YYYY-MM-DD"
                          )}
                          onChange={(e) => createEventChangeHandler(e)}
                        />
                      </div>
                      <div className="inputBox">
                        <label className="required">Event End Date</label>
                        <input
                          type="date"
                          name="end_date"
                          value={moment(createEventData.end_date).format(
                            "YYYY-MM-DD"
                          )}
                          onChange={(e) => createEventChangeHandler(e)}
                        />
                      </div>
                      <div className="editBox">
                        <button
                          className="blueSaveBtn"
                          onClick={() => eventDataCreateHandler()}
                          disabled={createLoader}
                        >
                          {
                            createLoader ? "Loading..." : "Create Event"
                          }
                        </button>
                        <button
                          className="blueBorderBtn"
                          onClick={() => {
                            setCreateEvent(false);
                            setCreateEventData({
                              admin_email: "",
                              admin_name: "",
                              admin_password: "",
                              end_date: new Date(),
                              event_name: "",
                              visit: 0,
                              used_credit: 0,
                              event_url: "",
                              start_date: new Date(),
                              total_credit: 0,
                            });
                          }}
                        >
                          Exit Without Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <Modal
          show={deleteEventModal}
          onHide={handleClose}
          size="lg"
          centered
          className="eventDeleteModal"
        >
          <Modal.Body>
            <div className="eventPreview">
              <FaExclamationTriangle />
              <h3>Are you sure you want to delete this event?</h3>
              <p>Once deleted, you will not be able to retrieve it again.</p>
              <div className="actionBtns">
                <button
                  className="bgBtn"
                  onClick={() => handleDelete(currentRow)}
                >
                  Delete
                </button>
                <button className="borderBtn" onClick={() => handleClose()}>
                  Cancel
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </section>
    </SuperAdminLogin>
  );
};

export default Events;
