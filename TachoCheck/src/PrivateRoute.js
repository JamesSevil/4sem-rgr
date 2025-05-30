import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const isAuthenticated = sessionStorage.getItem("username") || localStorage.getItem("username");

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }
        
    return children;
};

export default PrivateRoute;