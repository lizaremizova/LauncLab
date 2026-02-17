import Home from "./pages/Home";
import Register from "./pages/Register";
import { useState } from "react";

export default function App() {
    const [page, setPage] = useState("home");

    return (
        <>
            <div style={{ display: "flex", gap: 12, padding: 12 }}>
                <button onClick={() => setPage("home")}>Home</button>
                <button onClick={() => setPage("register")}>Register</button>
            </div>

            {page === "home" ? <Home /> : <Register />}
        </>
    );
}

