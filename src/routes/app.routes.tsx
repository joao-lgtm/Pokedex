import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";

// Detalhe e jogo carregam sob demanda: o primeiro acesso no celular baixa só a Home
const Pokemon = lazy(() => import("../pages/Pokemon").then((m) => ({ default: m.Pokemon })));
const Game = lazy(() => import("../pages/Game").then((m) => ({ default: m.Game })));


export function AppRoutes() {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/pokemon/:name" element={<Pokemon/>} />
                <Route path="/game" element={<Game/>} />
                <Route path="*" element={<Home />} />
            </Routes>
        </Suspense>
    )
}
