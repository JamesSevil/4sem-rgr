import express from "express";
import multer from "multer";
import path from "path";
import Users from "../mongo/users.js";
import Files from "../mongo/files.js";
import verifytoken from "./verifytoken.js";

const router = express.Router();

// настройка multer для загрузки файлов в память
const storage = multer.memoryStorage();
const upload = multer({storage});

function XOR(buffer, key) {
    for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= key;
    }
    return buffer;
}

router.post("/", upload.single("file"), verifytoken, async (req, res) => {
    try {
        const {username} = req.body;

        if (!username) {
            return res.status(400).json({success: false, message: "Не удалось распознать имя авторизованного пользователя!"});
        }
        if (!req.file) {
            return res.status(400).json({success: false, message: "Файл не был загружен!"});
        }
        const extencion = path.extname(req.file.originalname).toLowerCase();
        if (extencion != ".ddd") {
            return res.status(415).json({success: false, message: "Неверный формат файла!\nМожно загружать только файлы, с расширением .ddd"});
        }

        const user = await Users.findOne({login: username});
        if (!user) {
            return res.status(404).json({success: false, message: "Пользователь не найден в базе данных!"});
        }

        const key = 123;
        const decryptedBuffer = XOR(req.file.buffer, key);
        const decryptedData = decryptedBuffer.toString("utf-8");

        let jsonData;
        try {
            jsonData = JSON.parse(decryptedData);
        } catch (parseError) {
            // console.error("Ошибка парсинга JSON:", parseError);
            return res.status(422).json({success: false, message: "Файл поврежден или не является валидным JSON!"});
        }

        const savedFile = new Files({...jsonData, fileName: req.file.originalname, uploadedAt: new Date(), owner: user._id});
        await savedFile.save();

        res.status(200).json({success: true, message: "Файл успешно загружен!", fileId: savedFile._id});
    } catch (error) {
        console.error("Ошибка при загрузке или расшифровке:", error);
        res.status(500).json({success: false, message: "Ошибка сервера!"});
    }
});

export default router;