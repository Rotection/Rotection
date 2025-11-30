import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import GameDetails from "./components/GameDetails.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/:gameId" element={<GameDetailsWrapper />} />
    </Routes>
  </BrowserRouter>
);

// Wrapper to fetch the game by ID
function GameDetailsWrapper() {
  const { gameId } = useParams<{ gameId: string }>();
  const game = verifiedGames.find(g => g.id === gameId);

  if (!game) return <div className="text-center py-16">Game not found.</div>;

  return <GameDetails game={game} onBack={() => window.history.back()} />;
}
