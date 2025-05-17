import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import Details from "./pages/Details";
import PrivateRoute from "./PrivateRoute";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>}/>
                <Route path="/upload" element={<PrivateRoute><Upload/></PrivateRoute>}/>
                <Route path="/details/:fileId" element={<PrivateRoute><Details/></PrivateRoute>}/>
            </Routes>
        </Router>
    );
};

export default App;