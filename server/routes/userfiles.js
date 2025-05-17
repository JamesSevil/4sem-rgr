import express from "express";
import Files from "../mongo/files.js";
import Users from "../mongo/users.js";
import verifytoken from "./verifytoken.js";

const router = express.Router();

router.get("/:username", verifytoken, async (req, res) => {
    try {
        const username = req.params.username;
        const user = await Users.findOne({login: username});

        if (!user) {
            return res.status(404).json({success: false, message: "Пользователь не найден!"});
        }

        const files = await Files.find({owner: user._id}).sort({uploadedAt: -1});
        res.status(200).json({success: true, message: "Файлы успешно загружены!", files});
    } catch (error) {
        console.error("Ошибка при получении файлов пользователя:", error);
        res.status(500).json({success: false, message: "Ошибка сервера!"});
    }
});

router.delete("/:fileId", verifytoken, async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const deletedFile = await Files.findByIdAndDelete(fileId);

        if (!deletedFile) {
            return res.status(404).json({success: false, message: "Файл не найден!"});
        }

        res.status(200).json({success: true, message: "Файл успешно удалён!"});
    } catch (error) {
        console.error("Ошибка при удалении файла:", error);
        res.status(500).json({success: false, message: "Ошибка сервера!"});
    }
});

export default router;