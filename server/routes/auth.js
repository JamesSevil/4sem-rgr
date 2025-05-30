import express from "express";
import Users from "../mongo/users.js";
import Files from "../mongo/files.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import verifytoken from "./verifytoken.js";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;
const router = express.Router();

router.post("/register", async (req, res) => {
    const {login, password} = req.body;
    try {
        const checklogin = await Users.findOne({login});
        if (checklogin) {
            return res.status(409).json({success: false, message: "Пользователь с таким логином уже существует!"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Users({login, password: hashedPassword});
        await newUser.save();
        res.status(200).json({success: true, message: "Упешная регистрация!"});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Ошибка сервера!"});
    }
});

router.post("/login", async (req, res) => {
    const {login, password} = req.body;
    try {
        const user = await Users.findOne({login});
        if (!user) {
            return res.status(401).json({success: false, message: "Неверный логин!"});
        }

        const checkpass = await bcrypt.compare(password, user.password);
        if (!checkpass) {
            res.status(401).json({success: false, message: "Неверный пароль!"});
        }

        const payload = {id: user._id, login: user.login};
        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRES_IN});
        const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: REFRESH_TOKEN_EXPIRES_IN});
        res.status(200).json({success: true, message: "Упешная авторизация!", accessToken, refreshToken});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Ошибка сервера!"});
    }
});

router.put('/', verifytoken, async (req, res) => {
    const {login, oldPassword, newPassword} = req.body;
    try {
        const user = await Users.findOne({login});
        if (!user) {
            return res.status(404).json({success: false, message: "Пользователь не найден в базе данных!"});
        }
        const checkPassword = await bcrypt.compare(oldPassword, user.password);
        if (!checkPassword) {
            return res.status(403).json({success: false, message: "Старый пароль неверный!"});
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        res.status(200).json({success: true, message: "Пароль успешно обновлён!"});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Ошибка сервера!"});
    }
});

router.delete("/", verifytoken, async (req, res) => {
    const {login} = req.body;
    try {
        const user = await Users.findOne({login});
        if (!user) {
            return res.status(404).json({success: false, message: "Пользователь не найден в базе данных!"});
        }
        
        await Files.deleteMany({owner: user._id});
        await Users.deleteOne({_id: user._id});
        res.status(200).json({success: true, message: "Учетная запись успешно удалена!"});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Ошибка сервера!"});
    }
});

router.post("/refresh", (req, res) => {
    const {refreshToken} = req.body;
    try {
        if (!refreshToken) {
            return res.status(401).json({success: false, message: "Нет refresh токена!"});
        }
    
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({success: false, message: "Невалидный refresh токен!"});
            }
    
            const payload = {id: user.id, login: user.login};
            const newAccessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRES_IN});
    
            res.status(200).json({success: true, accessToken: newAccessToken});
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Ошибка сервера!"});
    }
});

export default router;