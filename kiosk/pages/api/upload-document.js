import multer from "multer";
import path from "path";
import fs from "fs";
import { getAuth } from "@clerk/nextjs/server"; // for Clerk auth
import { db } from "@/lib/prisma"; // Prisma client

// Create the upload directory if not exists
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }

  try {
    // Clerk auth to get user ID
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Debug: Check if db is available
    console.log("db object:", typeof db);
    console.log("db.Document:", typeof db?.Document);

    // Upload file
    await runMiddleware(req, res, upload.single("file"));

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Save to Prisma DB
    const document = await db.Document.create({
      data: {
        userId,
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        type: "Report", // or pull from req.body if needed
        uploadedBy: "PATIENT",
      },
    });
    
    return res.status(200).json({
      message: "Upload successful",
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      document,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "File upload failed" });
  }
}
