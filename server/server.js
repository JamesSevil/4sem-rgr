import express from "express";
import cors from "cors";
import { connect } from "mongoose";
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";
import checklogRoutes from "./routes/checklog.js";
import userfilesRoutes from "./routes/userfiles.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/checklog", checklogRoutes);
app.use("/api/userfiles", userfilesRoutes);
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self';"
    );
    next();
});
const PORT = 5000;

connect("mongodb://localhost:27017/TachoCheck", {})
.then(() => console.log("Успешное подключение к базе данных!"))
.catch(error => console.error("Ошибка подключения к базе данных: ", error));

app.listen(PORT, () => {
    console.log(`Сервер работает на http://localhost:${PORT}`);
});