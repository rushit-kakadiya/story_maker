import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Slider from "react-slick";
import arrowRight from "../../public/images/icons/arrowRight2_white.svg";
import arrowLeft from "../../public/images/icons/arrowLeft2_white.svg";

function StickersToolbar({ stickers, handleSticker }) {
  const [showControls, setShowControls] = useState(true);
  const [enableLeftControl, setEnableLeftControl] = useState(false);
  const [enableRightControl, setEnableRightControl] = useState(false);
  const toolbarRef = useRef(null);

  useEffect(() => {
    updateControls();
  });

  const scroll = (x) => {
    let toolbar = toolbarRef.current;
    if (!toolbar) {
      return;
    }
    toolbar.scrollLeft += x;
  };

  const updateControls = () => {
    let toolbar = toolbarRef.current;
    if (!toolbar) {
      return;
    }

    setEnableLeftControl(toolbar.scrollLeft > 0);
    setEnableRightControl(
      toolbar.scrollLeft + toolbar.clientWidth < toolbar.scrollWidth
    );
    setShowControls(toolbar.clientWidth < toolbar.scrollWidth);
  };

  const scrollAmount = toolbarRef.current
    ? toolbarRef.current.clientWidth / 2
    : 100;

  const drag = (e) => {
    e.dataTransfer.setData("sticker", e.target.id);
  };

  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        "slick-prev slick-arrow customArrow" +
        (currentSlide === 0 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === 0 ? true : false}
      type="button"
    >
      <Image src={arrowLeft} width={20} height={20} alt="Camera Access" />
    </button>
  );
  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <button
      {...props}
      className={
        "slick-next slick-arrow customArrow" +
        (currentSlide === slideCount - 1 ? " slick-disabled" : "")
      }
      aria-hidden="true"
      aria-disabled={currentSlide === slideCount - 1 ? true : false}
      type="button"
    >
      <Image src={arrowRight} width={20} height={20} alt="Camera Access" />
    </button>
  );

  const backgroundSettings = {
    dots: false,
    infinite: false,
    autoplay: false,
    draggable: false,
    nextArrow: <SlickArrowRight />,
    prevArrow: <SlickArrowLeft />,
    slidesToShow: 5,
    slidesToScroll: 1,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div ref={toolbarRef} className="stickers sliderBox">
      <Slider {...backgroundSettings}>
        {stickers.map((sticker, index) => (
          <div style={{ width: 90 }} key={"sticker" + index}>
            <Image
            crossOrigin="anonymous"
            id={"sticker" + index}
            src={sticker}
            width={80}
            height={80}
            alt={"Sticker " + index}
            draggable="true"
            onDragStart={drag}
            onLoad={updateControls}
            onClick={(e) => {
              let stickerCopy = e.target.cloneNode(true);
              handleSticker(stickerCopy);
            }}
          />
          </div>
        ))}
      </Slider>
      {/* <div className="toolbarContainer">

      {showControls &&
        <div className={"controlButton" + (enableLeftControl ? "" : " disabled")} onClick={(x) => scroll(-scrollAmount)}>
          <FaChevronLeft className="customArrow" />
        </div>
      }
      <div className="toolbar" onScroll={updateControls}>
        {stickers.map((sticker, index) =>
          <Image
            crossOrigin="anonymous"
            className="toolbarItem sticker"
            id={"sticker" + index}
            key={index}
            src={`${sticker}`}
            width={80}
            height={80}
            alt={"Sticker " + index}
            draggable="true"
            onDragStart={drag}
            onLoad={updateControls}
            onClick={
              (e) => {
                let stickerCopy = (e.target).cloneNode(true)
                handleSticker(stickerCopy)
              }
            }
          />
        )}
      </div>

      {showControls &&
        <div className={"controlButton" + (enableRightControl ? "" : " disabled")} onClick={(x) => scroll(scrollAmount)}>
          <FaChevronRight className="customArrow" />
        </div>
      }
    </div> */}
    </div>
  );
}

export default StickersToolbar;
