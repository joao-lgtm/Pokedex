import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Pokemon } from "../pages/Pokemon";
import { Game } from "../pages/Game";


export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokemon/:name" element={<Pokemon/>} />
            <Route path="/game" element={<Game/>} />
        </Routes>
    )
}