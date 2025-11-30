import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import App from "./App.tsx";
import { GameDetails } from "./components/GameDetails";
import "./index.css";

// Mock data for verified games
export const verifiedGames = [
  {
    id: '101411193179895',
    name: '[ METALLIX ] Speedsters Sandbox',
    developer: 'Speedsters Sandbox',
    thumbnail: 'https://tr.rbxcdn.com/180DAY-bf6e00c4f61b35b36ea92d828e4c3232/768/432/Image/Webp/noFilter',
    safetyScore: 90,
    ageRating: '5+',
    ratings: { honesty: 5, safety: 4, fairness: 4, ageAppropriate: 5 },
    totalRatings: 'Staff',
    verified: true,
    description: `Speedsters Sandbox.

Find universal skins around the map from different games/animes/shows etc.
race other players and have fun!`,
    category: 'Sandbox'
  },
  {
    id: '2',
    name: 'Pilgrammed',
    developer: 'Phexonia Studios',
    thumbnail: 'https://tr.rbxcdn.com/180DAY-1985fb1fa6534213463d7814f3958298/768/432/Image/Webp/noFilter',
    safetyScore: 80,
    ageRating: '9+',
    ratings: { honesty: 5, safety: 4, fairness: 3, ageAppropriate: 4 },
    totalRatings: 1,
    verified: false,
    description: 'Pilgrammed is an open-world RPG game. You can craft guns and armor.',
    category: 'Party & Casual'
  },
  {
    id: '3',
    name: 'Prophecy Battle Arena',
    developer: '@GoldenObscurity',
    thumbnail: 'https://tr.rbxcdn.com/180DAY-f686b29c5acc0a09de9c8edb5eaddfd6/768/432/Image/Webp/noFilter',
    safetyScore: 90,
    ageRating: '9+',
    ratings: { honesty: 5, safety: 5, fairness: 4, ageAppropriate: 4 },
    totalRatings: 1,
    verified: true,
    description: 'Prophecy is a PvP round based battleground game. Choose from up to 12 different custom characters, and fight to the death!',
    category: 'Action RPG'
  },
];

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/:gameId" element={<GameDetailsWrapper />} />
    </Routes>
  </BrowserRouter>
);

// Wrapper component to load game by URL
function GameDetailsWrapper() {
  const { gameId } = useParams<{ gameId: string }>();
  const game = verifiedGames.find(g => g.id === gameId);

  if (!game) {
    return (
      <div className="text-center py-16 text-gray-700">
        <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
        <p>The game you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return <GameDetails game={game} onBack={() => window.history.back()} />;
}
