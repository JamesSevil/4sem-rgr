import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (username.length < 4 || username.length > 10) {
            alert("Логин должен содержать от 4 до 10 символов!");
            return;
        } else if (password.length < 4 || password.length > 20) {
            alert("Пароль должен содержать от 4 до 20 символов!");
            return;
        } else if (password !== confirmPassword) {
            alert("Пароли не совпадают!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", {
                login: username,
                password: password
            });
    
            if (response.status === 200 && response.data.success) {
                console.log(response.data.message);
                alert("Вы успешно зарегистрировались!\nСейчас вы будете перенаправлены на страницу авторизации");
                navigate("/login");
            } else {
                console.error("Ошибка при регистрации: ", response.data.message);
                alert(`Не удалось зарегистрироваться: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Ошибка при регистрации: ", error.response.data.message);
            alert(`Не удалось зарегистрироваться: ${error.response.data.message}`);
        }
    };

    return (
        <div className="register">
            <h2>Регистрация</h2>

            <form onSubmit={handleSubmit}>
                <div className="input">
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Логин"
                        required
                    />
                </div>
                <div className="input">
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Пароль"
                        required
                    />
                </div>
                <div className="input">
                    <input
                        type="password"
                        id="confirmpassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Повтор пароля"
                        required
                    />
                </div>
                <button type="submit">Зарегистрироваться</button>

                <p>Уже есть аккаунт? <Link to="/login">Войдите</Link></p>
            </form>
        </div>
    );
};

export default Register;