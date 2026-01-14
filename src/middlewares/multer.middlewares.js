import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// process.cwd() gets the root folder of your project, ensuring it works on Render
const tempDir = path.join(process.cwd(), "public/temp");

// Check if the folder exists; if not, create it automatically
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir)
  },
  filename: function (req, file, cb) {
    const uniqueName = crypto.randomBytes(16).toString("hex") + "-" + file.originalname
    cb(null, uniqueName)
  }
})

export const upload = multer({ storage });