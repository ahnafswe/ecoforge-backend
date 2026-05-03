import { Router } from "express";
import multer from "multer";
import { mediaController } from "./media.controller";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: { fileSize: 3 * 1024 * 1024 },
});

router.post("/avatar", upload.single("image"), mediaController.uploadAvatar);

router.post("/idea-thumbnail", upload.single("image"), mediaController.uploadIdeaThumbnail);

export const mediaRouter = router;
