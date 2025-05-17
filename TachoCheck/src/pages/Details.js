import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import api from "../api";

const Details = () => {
    const { fileId } = useParams();
    const [logData, setLogData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLog = async () => {
            try {
                const response = await api.get(`/checklog/${fileId}`);

                if (response.status === 200) {
                    setLogData(response.data);
                } else {
                    console.error("Ошибка при загрузке данных файла: ", response.data.message);
                    alert(`Не удалось загрузить данные файла: ${response.data.message}`);
                }
            } catch (error) {
                console.error("Ошибка при загрузке данных файла: ", error.response.data.message);
                alert(`Не удалось загрузить данные файла: ${error.response.data.message}`);
            }
        };
        fetchLog();
    }, [fileId]);

    if (!logData) return <div>Загрузка...</div>;

    return (
        <div className="details">
            <h2>Данные карты</h2>

            <b>Имя:</b> {logData.cardHolderIdentification.firstName} {logData.cardHolderIdentification.lastName}<br></br>
            <b>Номер карты:</b> {logData.cardNumber}

            <h3>Активность</h3>
            {logData.activityData.map((day, index) => (
                <div key={index}>
                    <h4>{day.date}</h4>
                    <ul>
                        {day.activities.map((act, idx) => (
                            <li key={idx}>{act.type} с {format(new Date(act.start), "dd.MM.yyyy HH:mm:ss")} по {format(new Date(act.end), "dd.MM.yyyy HH:mm:ss")}</li>
                        ))}
                    </ul>
                </div>
            ))}

            <h3>Нарушения</h3>
            {logData.violations.map((v, idx) => (
                <p key={idx}>{v.type}: {v.actual} {v.units} (лимит: {v.limit})</p>
            ))}

            <h3>События и ошибки</h3>
            {logData.eventsAndFaults.map((e, idx) => (
                <p key={idx}>{e.event} ({format(new Date(e.timestamp), "dd.MM.yyyy HH:mm:ss")})</p>
            ))}

            <button className="back-button" onClick={() => {navigate('/')}}>Вернуться на главную страницу</button>
        </div>
    );
};

export default Details;