import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Upload = () => {
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleUpload = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("file", file);
        const username = sessionStorage.getItem("username") || localStorage.getItem("username");
        formData.append("username", username);

        try {
            const response = await api.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200 && response.data.success) {
                console.log(response.data.message);
                const fileId = response.data.fileId;
                navigate(`/details/${fileId}`);
            } else {
                console.error("Ошибка при загрузке файла: ", response.data.message);
                alert(`Не удалось загрузить файл: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Ошибка при загрузке файла: ", error.response.data.message);
            alert(`Не удалось загрузить файл: ${error.response.data.message}`);
        }
    };

    return (
        <div className="upload">
            <h2>Загрузка файла</h2>

            <form onSubmit={handleUpload}>
                <div className="inputfile">
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                    <button type="submit">Загрузить</button>
                </div>
            </form>

            <p><button onClick={() => {navigate('/')}}>Назад</button></p>
        </div>
    );
};

export default Upload;