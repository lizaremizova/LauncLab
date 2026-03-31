import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'
import AddJob from "@/pages/AddJob.jsx";
import Profile from "./pages/Profile.jsx"
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path='/login' element={<Login />} />
                <Route path={'/post'} element={<AddJob />} />
                <Route path={'/Profile'} element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
}
