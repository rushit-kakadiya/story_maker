import axios from "axios";
import moment from "moment";
import Image from "next/image";
import { Modal } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback, useMemo } from "react";
import DataTable from "react-data-table-component";
import CustomPagination from "../../../components/pagination/CustomPagination";
import { toast } from "react-toastify";
import { CSVLink } from "react-csv";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfDocument from "../../../components/PdfDocument";
import { FaTimes, FaRegImages, FaTrash } from "react-icons/fa";
import { saveAs } from "file-saver";
import EventAdminLogin from "../../../components/EventAdminLogin/EventAdminLogin";
import "react-data-table-component-extensions/dist/index.css";
import RedirectToSevenue from '../../../components/RedirectToSevenue'

const Entries = () => {
  const router = useRouter();
  const { eventUrl } = router.query;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageModal, setImageModal] = useState(false);
  const [modalImg, setModalImage] = useState(null);
  const [modalImgData, setModalImageData] = useState(null);
  const [exportData, setExportData] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const fetchUsers = useCallback(
    async (currentPage, perPage) => {
      setLoading(true);
      const response = await axios.get(
        `${window.location.origin}/api/${eventUrl}/allEntries/?perPage=${perPage}&page=${currentPage}`
      );
      setData(
        response.data.getData.map((el, i) => {
          return {
            ...el,
            name: `${el.name ? el.name : "-"}`,
            email: `${el.email ? el.email : "-"}`,
            id: `${i + 1}`,
            upload_time: `${moment(el.createdAt).format("hh:mm A")}`,
            upload_date: `${moment(el.createdAt).format("DD MM YYYY")}`,
            image_view: (
              <div className="entriesImg" key={"image" + i}>
                <Image src={el.image} alt="" width={60} height={60} />
              </div>
            ),
            view: (
              <button
                className="changeBtn"
                key={"view" + i}
                onClick={() => shareModalHandler(el.image, el)}
              >
                <FaRegImages />
                View
              </button>
            ),
            delete: (
              <button
                className="changeBtn"
                key={"delete" + i}
                onClick={handleDelete(el)}
              >
                <FaTrash />
                Delete
              </button>
            ),
          };
        })
      );
      setTotalRows(response.data.count);
      setLoading(false);
      const all_data = await axios.get(
        `${window.location.origin}/api/${eventUrl}/allEntries`
      );
      setExportData(
        all_data
          ? all_data.data.getData.map((el, i) => {
              return {
                id: `${i + 1}`,
                name: `${el.name ? el.name : "-"}`,
                email: `${el.email ? el.email : "-"}`,
                image: `${el.image}`,
                upload_time: `${moment(el.createdAt).format("hh:mm A")}`,
                upload_date: `${moment(el.createdAt).format("DD MM YYYY")}`,
              };
            })
          : null
      );
    },
    [eventUrl]
  );

  useEffect(() => {
    fetchUsers(currentPage, perPage);
  }, [fetchUsers, currentPage, perPage]);

  useEffect(() => {
    setTimeout(() => {
      setLoadingPdf(true);
    }, 3000);
  }, []);

  const handleDelete = useCallback(
    (row) => async () => {
      await axios
        .delete(
          `${window.location.origin}/api/${eventUrl}/removeEntry/?deleteids=${row._id}`
        )
        .then((res) =>
          toast.success("Entrie deleted", {
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
      fetchUsers(currentPage, perPage);
    },
    [perPage, currentPage, eventUrl, fetchUsers]
  );

  const selectDeleteHandler = async () => {
    let idArray = [];
    if (selectedRow) {
      selectedRow.map((el) => {
        idArray.push(el._id);
      });
    }

    await axios
      .delete(
        `${window.location.origin}/api/${eventUrl}/removeEntry/?deleteids=${idArray}`
      )
      .then((res) =>
        toast.success("Entrie deleted", {
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
    fetchUsers(currentPage, perPage);

    setToggleClearRows(!toggledClearRows);
  };

  const handlePageChange = (page) => {
    fetchUsers(page);
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchUsers(page, newPerPage);
    setPerPage(newPerPage);
  };

  const shareModalHandler = (img, data) => {
    setModalImage(img);
    setModalImageData(data);
    setImageModal(true);
  };

  const handleClose = () => {
    setImageModal(false);
    setModalImageData(null);
    setModalImage(null);
  };

  const columns = useMemo(
    () => [
      {
        name: "No.",
        selector: "id",
      },
      {
        name: "Name",
        selector: "name",
        sortable: true,
      },
      {
        name: "Email",
        selector: "email",
        sortable: true,
      },
      {
        name: "Upload Time",
        selector: "upload_time",
        sortable: true,
      },
      {
        name: "Upload Date",
        selector: "upload_date",
        sortable: true,
      },
      {
        name: "Photo",
        selector: "image_view",
        sortable: true,
      },
      {
        selector: "view",
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
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Photo", key: "image" },
    { label: "Upload Time", key: "upload_time" },
    { label: "Upload Date", key: "upload_date" },
  ];

  const handleChange = ({ selectedRows }) => {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    setSelectedRow(selectedRows);
  };

  const download = (img) => {
    saveAs(img, "image.jpg");
  };

  return (
    <EventAdminLogin nav={true}>
      <section className="adminInterface-content-box">
      <RedirectToSevenue />
        <div className="workspace entriesBox">
          <div className="boothDetails">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="bgBox">
                  <h3>Entries</h3>
                  <div className="detailsBox pt-0">
                    <div className="imgDetailsTable">
                      <div className="buttonsBlues">
                        {exportData ? (
                          <button className="dataTableBlueBtn">
                            <CSVLink data={exportData} headers={headers}>
                              Export CSV
                            </CSVLink>
                          </button>
                        ) : null}
                        <button
                          className="dataTableBlueBtn"
                          onClick={selectDeleteHandler}
                        >
                          <FaTrash />
                          Delete
                        </button>
                        {exportData ? (
                          <button className="dataTableBlueBtn">
                            {loadingPdf ? (
                              <PDFDownloadLink
                                document={<PdfDocument data={exportData} />}
                                fileName="EventImages.pdf"
                              >
                                {({ blob, url, loading, error }) =>
                                  loading
                                    ? "Loading document..."
                                    : "Download Pdf"
                                }
                              </PDFDownloadLink>
                            ) : (
                              "Download Pdf"
                            )}
                          </button>
                        ) : null}
                      </div>
                      <DataTable
                        className="Users"
                        columns={columns}
                        data={data}
                        progressPending={loading}
                        conditionalRowStyles={conditionalRowStyles}
                        pagination
                        defaultSortFieldId="id"
                        paginationServer
                        paginationTotalRows={totalRows}
                        paginationDefaultPage={currentPage}
                        onRowsPerPageChange={handlePerRowsChange}
                        onPageChange={handlePageChange}
                        selectableRows
                        onSelectedRowsChange={handleChange}
                        paginationComponent={CustomPagination}
                        clearSelectedRows={toggledClearRows}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          show={imageModal}
          onHide={handleClose}
          size="lg"
          className="imagePrevModal"
        >
          <Modal.Body>
            <div className="imgPreview">
              <button className="closeModalBtn" onClick={handleClose}>
                <FaTimes />
              </button>
              <div className="imgBox">
                {modalImg ? (
                  <Image src={modalImg} width={400} height={400} alt="" />
                ) : null}
              </div>
              <div className="textBox">
                <h6>Information</h6>
                <ul>
                  {modalImgData ? (
                    <>
                      {modalImgData.file_name ? (
                        <li>
                          File Name: <span>{modalImgData.file_name}</span>
                        </li>
                      ) : null}

                      {modalImgData.name ? (
                        <li>
                          Name: <span>{modalImgData.name}</span>
                        </li>
                      ) : null}

                      {modalImgData.email ? (
                        <li>
                          Email: <span>{modalImgData.email}</span>
                        </li>
                      ) : null}

                      {modalImgData.file_size ? (
                        <li>
                          Size: <span>{modalImgData.file_size}</span>
                        </li>
                      ) : null}

                      {modalImgData.createdAt ? (
                        <li>
                          Upload Time:{" "}
                          <span>{`${moment(modalImgData.createdAt).format(
                            "hh:mm A"
                          )}`}</span>
                        </li>
                      ) : null}
                      {modalImgData.createdAt ? (
                        <li>
                          Upload Date:{" "}
                          <span>{`${moment(modalImgData.createdAt).format(
                            "DD MMMM YYYY"
                          )}`}</span>
                        </li>
                      ) : null}
                    </>
                  ) : null}
                </ul>
                {modalImg ? (
                  <button
                    className="downloadBlueBtn"
                    onClick={() => download(modalImg)}
                  >
                    Download
                  </button>
                ) : null}
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </section>
    </EventAdminLogin>
  );
};

export default Entries;
