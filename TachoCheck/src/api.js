import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

// добавление токена к каждому запросу
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// автоматическое обновление токена
api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = sessionStorage.getItem("refreshToken") || localStorage.getItem("refreshToken");

        if (!refreshToken) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/login";
            return Promise.reject(error);
        }

        try {
            const response = await axios.post("http://localhost:5000/api/auth/refresh", {refreshToken});

            const newAccessToken = response.data.accessToken;
            sessionStorage.setItem("accessToken", newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/login";
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

export default api;