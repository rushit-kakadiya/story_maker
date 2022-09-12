const jpegQuality = 0.8

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  }
);

export function cropImage(image, canvas, cropRect) {
  resizeCanvas(canvas, image.naturalWidth)

  var context = canvas.getContext('2d')
  if (!context) {
    throw Error("Unable to retrive context from canvas")
  }
  context.drawImage(image, cropRect.x, cropRect.y, cropRect.width, cropRect.height, 0, 0, canvas.width, canvas.height)

  return canvas.toDataURL('image/jpeg', 0.8)
}

export function rotateImage(image, rotation = 0) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) {
    throw Error("Unable to retrive context from canvas")
  }

  const orientationChanged = rotation === 90 || rotation === -90 || rotation === 270 || rotation === -270
  if (orientationChanged) {
    canvas.width = image.height
    canvas.height = image.width
  } else {
    canvas.width = image.width
    canvas.height = image.height
  }

  context.translate(canvas.width / 2, canvas.height / 2)
  context.rotate((rotation * Math.PI) / 180)
  context.drawImage(image, -image.width / 2, -image.height / 2)

  return canvas.toDataURL('image/jpeg', jpegQuality)
}

export async function compose(getUserImage,
  getOverlayImage,
  getBackgroundImage,
  stickers,
  canvas) {

    let userImage = await createImage(getUserImage);
    let overlayImage = await createImage(getOverlayImage);
    let backgroundImage = await createImage(getBackgroundImage);

  resizeCanvas(canvas, userImage.naturalWidth)
  layer(null, userImage, backgroundImage, canvas)
  layer(overlayImage, null, null, canvas)

  for (let sticker of stickers) {
    drawSticker(sticker, canvas)
  }


  return canvas.toDataURL()
}

function resizeCanvas(canvas, originalWidth) {
  const maxWidth = 2560
  const sideLength = Math.min(originalWidth, maxWidth)
  // canvas.width = sideLength
  canvas.width = 450
  // canvas.height = sideLength
  canvas.height = 450
}

function layer(topImage,
  middleImage,
  bottomImage,
  canvas) {

  var context = canvas.getContext('2d')
  if (!context) {
    throw Error("Unable to retrive context from canvas")
  }

  if (bottomImage) {
    context.drawImage(bottomImage, 0, 0, canvas.width, canvas.height)
  }

  if (middleImage) {
    context.drawImage(middleImage, 0, 0, canvas.width, canvas.height)
  }

  if (topImage) {
    context.drawImage(topImage, 0, 0, canvas.width, canvas.height)
  }
}

export function drawSticker(sticker, canvas) {
  let dataset = sticker.dataset
  let radians = parseFloat(dataset.radians)
  let scale = parseFloat(dataset.scale)

  let aspectRatio = sticker.clientWidth / sticker.clientHeight
  let width = (parseFloat(sticker.style.width) / 100) * canvas.width
  let height = width / aspectRatio

  let rect = {
    x: (parseFloat(sticker.style.left) / 100) * canvas.width,
    y: (parseFloat(sticker.style.top) / 100) * canvas.height,
    width: width,
    height: height
  }

  let img = sticker.querySelector(":scope > img")
  var context = canvas.getContext('2d')
  if (!context) {
    throw Error("Unable to retrive context from canvas")
  }

  context.save()
  context.translate(rect.x + (rect.width / 2), rect.y + (rect.height / 2))
  context.scale(scale, scale)
  context.rotate(radians)
  context.drawImage(img, -rect.width / 2, - rect.height / 2, rect.width, rect.height)
  context.restore()
}

export function processImageFile(imageFile, callback) {
  const reader = new FileReader()
  reader.readAsDataURL(imageFile)
  reader.onload = async () => {
    callback(reader.result)
  }
}

export function checkImageSize(imageData, minimumSize, completion) {
  let image = new Image()
  image.src = imageData
  image.onload = function () {
    completion(image.naturalWidth >= minimumSize.width && image.naturalHeight >= minimumSize.height)
  }
}