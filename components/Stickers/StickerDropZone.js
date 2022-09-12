import React, { useEffect } from 'react'
import * as StickerUtil from "./StickerUtils"

export default function StickerDropzone() {

  useEffect(() => {
    window.addEventListener("mousemove", (e) => StickerUtil.onMouseMove(e))

    window.addEventListener("touchmove", (e) => {
      StickerUtil.onMouseMove(e.changedTouches[0])
    })

    window.addEventListener('keydown', (e) => {
      if (e.key === "Escape") {
        StickerUtil.deactivate()
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        StickerUtil.deleteActive()
      }
    })
  })

  const allowDrop = (e) => {
    e.preventDefault()
    let stickerId = e.dataTransfer.getData("sticker")
    let stickerElement = document.getElementById(stickerId)

    return stickerElement && (stickerElement.parentNode).classList.contains("toolbar")
  }

  const drop = (e) => {
    e.preventDefault()

    let data = e.dataTransfer.getData("sticker")
    let img = document.getElementById(data)
    if (img == null) {
      return
    }

    let copy = img.cloneNode(true)
    StickerUtil.addSticker(copy, e)
  }

  return (
    <>
    <div id="stickersDropzone" onDragOver={allowDrop} onDrop={drop} onClick={StickerUtil.handleOutsideClick}></div>
    </>
  )
}
