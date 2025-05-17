import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import api from "../api"

const Home = () => {
    const [username, setUsername] = useState('');
    const [files, setFiles] = useState([]);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = sessionStorage.getItem("username") || localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
            getFiles(storedUsername);
        }
    }, []);

    const getFiles = async (username) => {
        try {
            const response = await api.get(`/userfiles/${username}`);
            setFiles(response.data.files);

            if (response.status === 200 && response.data.success) {
                console.log(response.data.message);
            } else {
                console.error("Ошибка при получении файлов: ", response.data.message);
                alert(`Не удалось загрузить список файлов: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Ошибка при получении файлов: ", error.response.data.message);
            alert(`Не удалось загрузить список файлов: ${error.response.data.message}`);
        }
    };

    const handleDeleteFile = async (fileId) => {
        try {
            const response = await api.delete(`/userfiles/${fileId}`);

            if (response.status === 200 && response.data.success) {
                setFiles(prevFiles => prevFiles.filter(file => file._id !== fileId)); // обновление состояния массива файлов
                alert("Файл успешно удалён!");
            } else {
                console.error("Ошибка при удалении файла: ", response.data.message);
                alert(`Не удалось удалить файл: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Ошибка при удалении файла: ", error.response.data.message);
            alert(`Не удалось удалить файл: ${error.response.data.message}`);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert("Пароли не совпадают!");
            return;
        } else if (oldPassword === newPassword) {
            alert("Старый и новый пароли совпадают!");
            return;
        } else if (newPassword.length < 4 || newPassword.length > 20) {
            alert("Пароль должен содержать от 4 до 20 символов!");
            return;
        }

        try {
            const response = await api.put("/auth", {
                login: username,
                oldPassword: oldPassword,
                newPassword: newPassword
            });

            if (response.status === 200 && response.data.success) {
                console.log(response.data.message);
                alert("Пароль был успешно изменен!");
            } else {
                console.error("Ошибка при изменении пароля: ", response.data.message);
                alert(`Не удалось изменить пароль: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Ошибка при изменении пароля: ", error.response.data.message);
            alert(`Не удалось изменить пароль: ${error.response.data.message}`);
        }

        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleLogout = () => {
        sessionStorage.removeItem("username");
        localStorage.removeItem("username");
        sessionStorage.removeItem("refreshToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("accessToken");
        navigate('/login');
    };

    const handleDeleteUser = async () => {
        // eslint-disable-next-line no-restricted-globals
        const choice = confirm("Вы уверены, что хотите удалить учетную запись?\nПозже отменить действие будет невозможно!");
        if (!choice) return;
        
        try {
            const response = await api.delete("/auth", {data: {login: username}});

            if (response.status === 200 && response.data.success) {
                console.log(response.data.message);
                alert("Учетная запись удалена!\nСейчас вы будете перенаправлены на страницу авторизации");
                handleLogout();
            } else {
                console.error("Ошибка при удалении учетной записи: ", response.data.message);
                alert(`Не удалось удалить учетную запись: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Ошибка при удалении учетной записи: ", error.response.data.message);
            alert(`Не удалось удалить учетную запись: ${error.response.data.message}`);
        }
    };

    return (
        <div className="home">
            <h2>Добро пожаловать, {username}!</h2>

            <Link to="/upload">Загрузить новый файл</Link>
            
            <div className="changepassword">
                <p></p>
                <b>Смена пароля</b>
                <div className="input">
                    <input
                        type="password"
                        id="oldpassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Старый пароль"
                        required
                    />
                </div>
                <div className="input">
                    <input
                        type="password"
                        id="newpassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Новый пароль"
                        required
                    />
                </div>
                <div className="input">
                    <input
                        type="password"
                        id="confirmpassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Повтор нового пароля"
                        required
                    />
                </div>
                <button onClick={handleChangePassword}>Сменить</button>
            </div>
            
            <p><button onClick={handleLogout}>Выйти из системы</button></p>

            <p><button className="del-button" onClick={handleDeleteUser}>Удалить учетную запись</button></p>

            <hr />
            <b>История загрузок</b>
            <div className="filelist">
                {files.length === 0 ? (<p>Файлы не найдены</p>) : (
                    files.map(file => (
                        <div className="files" key={file._id}>
                            <Link to={`/details/${file._id}`}>{file.fileName} - {format(new Date(file.uploadedAt), "dd.MM.yyyy HH:mm:ss")}</Link>
                            <button onClick={() => handleDeleteFile(file._id)}>Удалить</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;