import { VideoCapture } from "camera-capture";
import fs from "fs";

export const captureImages = async (mime: "image/jpeg" | "image/png" | "rgba" | "image/webp") => {
  const c = new VideoCapture({
    mime: mime,
    width: 1280,
    height: 720,
    fps: 60,
  });
  fs.mkdirSync("tmp", { recursive: true });
  let currentFrame = 0;
  await c.initialize();
  c.addFrameListener((frame: ImageData) => {
    // console.log("Frame", frame.width, frame.height, frame.data.length, currentFrame + 1);
    fs.writeFile(`tmp/${currentFrame}.${mime}`, frame.data, () => {
      console.log("Frame written: ", currentFrame);
    });
    currentFrame++;
  });
  c.start();
  console.log("Camera started");
  //   let f = await c.readFrame(); // PNG as configured
  //   fs.writeFileSync("tmp.png", f.data);
  //   f = await c.readFrame("image/webp"); // take another shot this time as webp image
  //   fs.writeFileSync("tmp.webp", f.data);
  //   f = await c.readFrame("image/jpeg"); // jpeg
  //   fs.writeFileSync("tmp.jpg", f.data);
  //   f = await c.readFrame("rgba"); // raw image data (as default)
  //   fs.writeFileSync("tmp-8bit-200x200.rgba", f.data);
  //   console.log("Image captured", f.width, f.height, f.data.length);

  return await new Promise<number>((resolve) => {
    setTimeout(async () => {
      console.log("STOPIING");
      await c.stop();
      resolve(currentFrame);
    }, 1000);
  });
};
