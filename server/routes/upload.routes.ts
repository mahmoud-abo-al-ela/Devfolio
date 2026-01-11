import { Router } from "express";
import multer from "multer";
import cloudinary from "../cloudinary";
import { Readable } from "stream";
import { requireAuth } from "./auth.routes";

const router = Router();

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

// Upload project preview image
router.post(
  "/project-preview",
  requireAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Convert buffer to stream
      const stream = Readable.from(req.file.buffer);

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "Devfolio/assets",
            transformation: [
              { width: 1200, height: 630, crop: "fill" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.pipe(uploadStream);
      });

      res.json({
        url: (result as any).secure_url,
        publicId: (result as any).public_id,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Upload failed" });
    }
  }
);

export default router;
