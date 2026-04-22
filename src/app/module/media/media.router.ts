import { Router } from "express";
import multer from "multer";
import { uploadAvatar } from "./media.controller";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: { fileSize: 2 * 1024 * 1024 },
});

router.post("/avatar", upload.single("image"), uploadAvatar);

export const mediaRouter = router;
