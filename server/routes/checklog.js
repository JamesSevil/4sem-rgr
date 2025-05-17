import express from "express";
import Files from "../mongo/files.js";
import { Types } from "mongoose";
import verifytoken from "./verifytoken.js";

const router = express.Router();

router.get("/:fileId", verifytoken, async (req, res) => {
    try {
        const fileId = req.params.fileId;
        if (!Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({success: false, message: "Некорректный ID файла!"});
        }

        const file = await Files.findById(fileId).populate("owner", "login");
        if (!file) {
            return res.status(404).json({success: false, message: "Файл не найден!"});
        }

        res.status(200).json(file);
    } catch (error) {
        console.error("Ошибка при получении файла:", error);
        res.status(500).json({success: false, message: "Ошибка сервера!"});
    }
});

export default router;