import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // file- destination in your disk
    //console.log("File received:", file);
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // console.log("Saving file:", file.originalname);
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
