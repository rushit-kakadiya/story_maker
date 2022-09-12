import { MouseEvent } from "react"

export function newSticker(img) {
  img.classList.remove("sticker")
  img.setAttribute('draggable', "false")
  img.style.pointerEvents = "none"

  let sticker = document.createElement("div")
  sticker.className = "sticker"
  sticker.style.width = "33%"
  sticker.dataset.radians = "0"
  sticker.dataset.scale = "1"
  sticker.appendChild(img)
  return sticker
}

export function handleOutsideClick(e) {
  if (e == null) {
    return
  }

  let classList = (e.target).classList
  if (classList.contains("sticker") 
  || classList.contains("control")
  || classList.contains("controlButton")) {
    return
  }
  deactivate()
}

export function deactivate() {
  var activeStickers = getAllActiveStickers()
  activeStickers.forEach( sticker => {
    sticker.classList.remove("activeSticker")

    let controls = Array.from(
      sticker.querySelectorAll(":scope > div.control")
    )

    controls.forEach(control => {
      control.parentNode?.removeChild(control)
    })
  })
}

export function activate(sticker) {
  deactivate()
  sticker.className += " activeSticker"
  sticker.onmousedown = onMouseDown
  sticker.ontouchstart = (e) => onMouseDown(e.changedTouches[0])
  sticker.onmouseup = onMouseUp
  sticker.ontouchcancel = onMouseUp
  sticker.ontouchend = onMouseUp
  sticker.style.zIndex = `${getHighestZIndex() + 1}`
  addControls(sticker)
}

export function onMouseMove(e) {
  let sticker = getActiveSticker()
  if (!sticker) {
    return
  }

  if (sticker.dataset.action === "move") {
    move(e, sticker)
  }
  if (sticker.dataset.action === "transform") {
    transform(e, sticker)
  }
}

export function deleteActive() {
  getAllActiveStickers().forEach(sticker => sticker.parentNode?.removeChild(sticker))
}

export function addSticker(img, e) {
  if (e) {
    e.persist()
  }

  // Sticker height isn't correct until the image is fully loaded
  img.onload = function() {
    let sticker = newSticker(img)
  
    let container = document.getElementById("stickersDropzone")
    if (!container) {
      return
    }
    sticker.style.height = "33%"
    container.appendChild(sticker)
    activate(sticker)
  
    if (e) {
      sticker.dataset.moveOffsetX = `${sticker.clientWidth / 2.0}`
      sticker.dataset.moveOffsetY = `${sticker.clientHeight / 2.0}`
      move(e, sticker)
    } else {
      let containerSize = getContainerSize()
      sticker.style.left = (containerSize.width - sticker.clientWidth) / 2 / containerSize.width * 100 + "%"
      sticker.style.top = (containerSize.height - sticker.clientHeight) / 2 / containerSize.height * 100 + "%"
    }
  }
}

function onMouseDown(e) {
  if (e.button !== 0 && e.force == null) {
    return
  }

  if (e.target.classList.contains("sticker")) {
    let sticker = e.target
    activate(sticker)

    let stickerTopLeft = getStickerTopLeftPx(sticker)
    let mousePosition = getMousePosition(e)

    sticker.dataset.moveOffsetX = `${mousePosition.x - stickerTopLeft.x}`
    sticker.dataset.moveOffsetY = `${mousePosition.y - stickerTopLeft.y}`
    sticker.dataset.action = "move"
  } else if (e.target.classList.contains("transformControl")) {
    let sticker = getActiveSticker()
    if (sticker) {
      sticker.dataset.action = "transform"
    }
  } else if (e.target.classList.contains("deleteControl")) {
    deleteActive()
  }
}

export function onMouseUp() {
  let sticker = getActiveSticker()
  if (sticker) {
    sticker.dataset.action = ""
  }
}

function getActiveSticker() {
  return getAllActiveStickers()[0] ?? null
}

function getAllStickers(){
  return Array.from(
    document.querySelectorAll(".sticker")
  )
}

function getAllActiveStickers() {
  return Array.from(
    document.querySelectorAll(".activeSticker")
  )
}

function getHighestZIndex() {
  let zIndex = 0
  getAllStickers().forEach(sticker => {
    if (sticker.style.zIndex) {
      zIndex = Math.max(zIndex, parseInt(sticker.style.zIndex))
    }
  })
  return zIndex
}

function move(e, sticker) {
  if (sticker == null) {
    return
  }

  let mousePosition = getMousePosition(e)

  let pixels = {
    x: mousePosition.x - parseFloat(sticker.dataset.moveOffsetX),
    y: mousePosition.y - parseFloat(sticker.dataset.moveOffsetY)
  }

  let containerSize = getContainerSize()

  sticker.style.left = 100 * (pixels.x / containerSize.width) + "%"
  sticker.style.top = 100 * (pixels.y / containerSize.height) + "%"
}

function transform(e, sticker) {
  let stickerCenter = getStickerCenter(sticker)
  let x0 = stickerCenter.x
  let y0 = stickerCenter.y

  let mousePosition = getMousePosition(e)
  let x1 = mousePosition.x
  let y1 = mousePosition.y

  let distance = Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2))
  let img = sticker.getElementsByTagName('img')[0]
  let α = Math.atan(img.height / img.width)
  let newWidth = distance * Math.cos(α) * 2

  newWidth = Math.min(Math.max(newWidth, 40), 500)

  let slope = (y1 - y0) / (x1 - x0)

  let radians = (Math.atan(slope) + α)
  if (x1 < x0) {
    radians += Math.PI
  }
  let degrees = radians * (180 / Math.PI)
  let scale = newWidth / img.width

  sticker.style.transform = 'rotate(' + degrees + 'deg) scale(' + scale + ')'
  sticker.dataset.radians = `${radians}`
  sticker.dataset.scale = `${scale}`

  resizeControls(sticker)
}

function resizeControls(sticker) {
  // do inverse scale so buttons appear same size
  let inverseScale = 1 / parseFloat(sticker.dataset.scale)
  let controls = Array.from(sticker.querySelectorAll(".control"))

  controls.forEach(control => {
    control.style.transform = `scale(${inverseScale})`
  })
}

function getMousePosition(e) {
  let container = document.getElementById("stickersDropzone")

  return {
    x: e.clientX - container.getBoundingClientRect().left + window.scrollX,
    y: e.clientY - container.getBoundingClientRect().top + window.scrollY
  }
}

function getStickerTopLeftPx(sticker) {
  let containerSize = getContainerSize()
  return {
    x: parseInt(sticker.style.left, 10) / 100 * containerSize.width,
    y: parseInt(sticker.style.top, 10) / 100 * containerSize.height
  }
}

function getStickerCenter(sticker) {
  let topLeftPx = getStickerTopLeftPx(sticker)
  return {
    x: topLeftPx.x + (sticker.offsetWidth / 2),
    y: topLeftPx.y + (sticker.offsetHeight / 2)
  }
}

function getContainerSize() {
  let container = document.getElementById("stickersDropzone")

  if (!container) {
    throw new Error("Container missing")
  }

  return {
    width: container.offsetWidth,
    height: container.offsetHeight
  }
}

function addControls(sticker) {
  let transformControl = document.createElement("div")
  transformControl.classList.add("transformControl", "control")
  sticker.appendChild(transformControl)

  let deleteControl = document.createElement("div")
  deleteControl.classList.add("deleteControl", "control")
  sticker.appendChild(deleteControl)

  resizeControls(sticker)
}
