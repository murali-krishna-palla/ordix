const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createStorage = (folder) => {
  const uploadPath = path.join(__dirname, "..", "uploads", folder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const uniqueName =
        Date.now() + "-" + Math.round(Math.random() * 1e9);

      cb(
        null,
        uniqueName + path.extname(file.originalname)
      );
    },
  });
};

const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp/;

  const ext = allowed.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    return cb(null, true);
  }

  cb(new Error("Only image files are allowed."));
};

const uploadLogo = multer({
  storage: createStorage("logos"),
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const uploadBanner = multer({
  storage: createStorage("banners"),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  uploadLogo,
  uploadBanner,
};