const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  }
);

export default async function ChangeBackground(imageSrc, backImage, safeArea) {
    let image = "";
    let backImage1 = "";
    let overlayimage1 = "";
    image = await createImage(imageSrc)
    backImage1 = await createImage(backImage)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = safeArea
    canvas.height = safeArea

    ctx.clearRect(0, 0, canvas.width *2, canvas.width *2);

    // translate canvas context to a central location on image to allow rotating around the center.
    ctx.translate(safeArea / 2, safeArea / 2)
    ctx.translate(-safeArea / 2, -safeArea / 2)

    // draw rotated image and store data.
    ctx.drawImage(
      backImage1,
      0,
      0,
      safeArea,
      safeArea
  )
    
    ctx.drawImage(
        image,
        0,
        0,
        safeArea,
        safeArea
    )

  return new Promise((resolve) => {
    let url = canvas.toDataURL("image/png");
      fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `${Date.now()}.png`, {
          type: "image/png",
        });
        resolve({ url, file });
      });
  });
}
