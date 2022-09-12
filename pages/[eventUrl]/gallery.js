import { useEffect, useState, useCallback } from "react";
import EventLogin from "../../components/EventLogin/EventLogin";
import Router, { useRouter } from "next/router";
import Image from "next/image";
import { Modal, Pagination } from "react-bootstrap";
import moment from "moment";
import RedirectToSevenue from '../../components/RedirectToSevenue'
import { FaTimes, FaSortAmountDownAlt } from "react-icons/fa";
import axios from "axios";

const Gallery = ({ data, eventName }) => {
  const router = useRouter();
  const { eventUrl } = router.query;
  const [imageModal, setImageModal] = useState(false);
  const [totalImg, setTotalImg] = useState(data.getData);
  const [modalImg, setModalImage] = useState(null);
  const [modalImgData, setModalImageData] = useState(null);
  const [assending, setAssending] = useState("");

  const [totalRows, setTotalRows] = useState(data.count);
  const [lower, setLower] = useState(1);
  const [higher, setHigher] = useState(48);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventBg, setEventBg] = useState(null);

  // useEffect(() => {
  //   fetchData(eventUrl, currentPage);
  // }, [eventUrl, currentPage]);

  useEffect(() => {
    setEventBg(localStorage.getItem("eventBackground"));
  }, []);

  const fetchData = async (eventUrl, currentPage) => {
    if (currentPage) {
      await axios
        .get(
          `${
            window.location.origin
          }/api/${eventUrl}/allEntries/?perPage=${48}&page=${currentPage}`
        )
        .then((res) => {
          setTotalImg(res.data.getData);
          setTotalRows(res.data.count);
        })
        .catch((err) => {
          console.error(err);
        });
    }
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

  const pageHandler = (no) => {
    if (no <= 0) {
      return setCurrentPage(1);
    }
    return setCurrentPage(no);
  };

  const toKbHandler = (bytes) => {
    return Math.round(bytes / 1024) + "KB";
  };

  return (
    <EventLogin>
      <section
        className="userInterface-content-box galleryContent"
        style={{ backgroundImage: `url(${eventBg ? eventBg : ""})` }}
      >
        <RedirectToSevenue />
        <div className="container-fluid ">
          <div className="row justify-content-center galleryBox">
            <div className="col-xl-10 col-lg-11">
              {eventName ? (
                <div className="title">
                  <h2>{eventName}</h2>
                </div>
              ) : null}
              <div className="imageSorting">
                <div className="sortBox">
                  <span>
                    <FaSortAmountDownAlt /> Sort
                  </span>
                  <select
                    name=""
                    id=""
                    onChange={(e) => setAssending(e.target.value)}
                    value={assending}
                  >
                    <option value="">Newest-Oldest</option>
                    <option value="yes">Oldest-Newest</option>
                  </select>
                </div>
              </div>
              <div className="imagesBox">
                {!totalImg
                  ? null
                  : !assending
                  ? totalImg
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      .map((el, i) => {
                        return (
                          <button
                            key={"img" + i}
                            className=""
                            onClick={() =>
                              shareModalHandler(el.image, {
                                fileName: el.file_name,
                                fileSize: el.file_size,
                                uploadTime: moment(el.createdAt).format(
                                  "hh:mm A"
                                ),
                                uploadDate: moment(el.createdAt).format(
                                  "DD MMMM YYYY"
                                ),
                              })
                            }
                          >
                            <Image
                              src={el.image}
                              width={170}
                              height={170}
                              alt=""
                            />
                          </button>
                        );
                      })
                  : totalImg
                      .sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                      )
                      .map((el, i) => {
                        return (
                          <button
                            key={"img" + i}
                            className=""
                            onClick={() =>
                              shareModalHandler(el.image, {
                                fileName: el.file_name,
                                fileSize: el.file_size,
                                uploadTime: moment(el.createdAt).format(
                                  "hh:mm A"
                                ),
                                uploadDate: moment(el.createdAt).format(
                                  "DD MMMM YYYY"
                                ),
                              })
                            }
                          >
                            <Image
                              src={el.image}
                              width={170}
                              height={170}
                              alt=""
                            />
                          </button>
                        );
                      })}
              </div>
            </div>
          </div>
        </div>
        {totalRows > 48 ? (
          <Pagination size="sm">
            <Pagination.First
              disabled={currentPage <= 1}
              onClick={(e) => {
                setLower(1);
                setHigher(48);
                fetchData(eventUrl, pageHandler(1), e);
              }}
            />
            <Pagination.Prev
              disabled={currentPage <= 1}
              onClick={(e) => {
                setLower(currentPage - 1 <= 1 ? 1 : (currentPage - 1) * 48);
                setHigher(currentPage - 1 <= 1 ? 48 : 48 * currentPage);
                fetchData(eventUrl, pageHandler(currentPage - 1), e);
              }}
            />
            <Pagination.Item disabled>
              {lower}-{higher}/{totalRows}
            </Pagination.Item>
            <Pagination.Next
              disabled={currentPage * 48 >= totalRows}
              onClick={(e) => {
                setLower(48 * currentPage + 1);
                setHigher(
                  48 * (currentPage + 1) <= totalRows
                    ? 48 * (currentPage + 1)
                    : Math.ceil(totalRows)
                );
                fetchData(eventUrl, pageHandler(currentPage + 1), e);
              }}
            />
            <Pagination.Last
              disabled={currentPage * 48 >= totalRows}
              onClick={(e) => {
                setLower((Math.ceil(totalRows / 48) - 1) * 48);
                setHigher(totalRows);
                fetchData(eventUrl, pageHandler(Math.ceil(totalRows / 48)), e);
              }}
            />
          </Pagination>
        ) : null}

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
                      {modalImgData.fileName ? (
                        <li>
                          File Name: <span>{modalImgData.fileName}</span>
                        </li>
                      ) : null}

                      {modalImgData.fileSize ? (
                        <li>
                          Size:{" "}
                          <span>{toKbHandler(modalImgData.fileSize)}</span>
                        </li>
                      ) : null}

                      {modalImgData.uploadTime ? (
                        <li>
                          Upload Time: <span>{modalImgData.uploadTime}</span>
                        </li>
                      ) : null}

                      {modalImgData.uploadDate ? (
                        <li>
                          Upload Date: <span>{modalImgData.uploadDate}</span>
                        </li>
                      ) : null}
                    </>
                  ) : null}
                </ul>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </section>
    </EventLogin>
  );
};

export default Gallery;

export async function getServerSideProps(context) {
  const { eventUrl } = context.query;
  // Fetch data from external API
  const res = await fetch(
    `${
      process.env.base_url
    }/api/${eventUrl}/allEntries/?perPage=${48}&page=${1}`
  );
  const data = await res.json();
  const galleryRes = await fetch(`${process.env.base_url}/api/${eventUrl}`);
  const galleryData = await galleryRes.json();

  if (!galleryData.require_gallery) {
    return {
      redirect: {
        permanent: false,
        destination: `/${eventUrl}`,
      },
    };
  }
  // Pass data to the page via props
  return { props: { data, eventName: galleryData.event_name } };
}
