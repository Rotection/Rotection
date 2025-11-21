import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Shield, Search } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { GameCard } from './components/GameCard';
import { GameDetails } from './components/GameDetails';
import { SubmitGameForm } from './components/SubmitGameForm';
import { FeaturesSection } from './components/FeaturesSection';
import { DiscordRedirect } from './components/DiscordRedirect';
import { motion, AnimatePresence } from 'motion/react';

type Game = {
  id: string;
  name: string;
  creators: string;
  description: string;
  ageGroup: string;
  category: string;
  gameLink: string;
  honesty: number;
  safety: number;
  fairness: number;
  ageAppropriate: number;
  ratingsCount: number;
  thumbnail: string;
  safetyScore: number;
  verified: boolean;
};

type View = 'home' | 'browse' | 'submit' | 'game-details';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubmitDiscord, setShowSubmitDiscord] = useState(false);
  const [loading, setLoading] = useState(true);

  // CSV URL from your published Google Sheet
  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdMlcR44cKlhuBXWvwsKGEhwg5Mdx6yuVPGjjcuFIvVM0h4r1FGbp9uyXuCpzoqYomZQsmjrgo02WD/pub?output=csv";

  useEffect(() => {
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        const parsed: Game[] = data.map((row, index) => ({
          id: index.toString(),
          name: row["Game Name"] || "",
          creators: row["Creators"] || "",
          description: row["Description"] || "",
          ageGroup: row["Age Group"] || "",
          category: row["Category"] || "",
          gameLink: row["Game Link"] || "",
          honesty: Number(row["Honesty"]) || 0,
          safety: Number(row["Safety"]) || 0,
          fairness: Number(row["Fairness"]) || 0,
          ageAppropriate: Number(row["Age-appropriate"]) || 0,
          ratingsCount: Number(row["Ratings"]) || 0,
          thumbnail: row["Thumbnail"] || "",
          safetyScore: Number(row["Safety Score"]) || 0,
          verified: row["Verified"]?.toLowerCase() === "true",
        }));
        setGames(parsed);
        setLoading(false);
      },
      error: (err) => {
        console.error("Error parsing CSV:", err);
        setLoading(false);
      },
    });
  }, []);

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.creators.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    setCurrentView('game-details');
  };

  const handleBackToBrowse = () => {
    setCurrentView('browse');
    setSelectedGame(null);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header 
        currentView={currentView} 
        onNavigate={setCurrentView}
        onSubmitGame={() => setShowSubmitDiscord(true)} 
      />

      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Hero onGetStarted={() => setCurrentView('browse')} />
            <FeaturesSection />

            <section className="py-16 px-4">
              <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
                  <h2 className="text-purple-600 mb-4">
                    <Shield className="inline-block w-10 h-10 mr-2" />
                    Featured Safe Games
                  </h2>
                  <p className="text-gray-600">These games have been verified by Rotection and loved by players like you!</p>
                </motion.div>

                {loading ? (
                  <p className="text-gray-500">Loading games...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredGames.slice(0, 3).map((game, index) => (
                      <motion.div key={game.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }}>
                        <GameCard game={game} onClick={() => handleGameClick(game)} />
                      </motion.div>
                    ))}
                  </div>
                )}

                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.5 }} className="text-center">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentView('browse')} className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors">
                    Browse All Verified Games
                  </motion.button>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}

        {currentView === 'browse' && (
          <motion.section key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="py-12 px-4 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
                <h1 className="text-purple-600 mb-4">Browse Verified Games</h1>
                <div className="relative max-w-2xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search games, developers, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-purple-200 focus:border-purple-600 focus:outline-none transition-all"
                  />
                </div>
              </motion.div>

              {loading ? (
                <p className="text-gray-500">Loading games...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGames.map((game) => (
                    <GameCard key={game.id} game={game} onClick={() => handleGameClick(game)} />
                  ))}
                </div>
              )}

              {!loading && filteredGames.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="text-center py-12">
                  <p className="text-gray-500">No games found matching your search.</p>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {currentView === 'game-details' && selectedGame && (
          <motion.div key="game-details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <GameDetails game={selectedGame} onBack={handleBackToBrowse} />
          </motion.div>
        )}

        {currentView === 'submit' && (
          <motion.div key="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <SubmitGameForm onCancel={() => setCurrentView('home')} />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-purple-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Shield className="w-8 h-8 mr-2 inline-block" />
          <span className="text-xl">Rotection</span>
          <p className="text-purple-200 mt-4">Making Roblox safer, one verified game at a time.</p>
          <p className="text-purple-300 text-sm mt-2">© 2025 Rotection</p>
        </div>
      </footer>

      {showSubmitDiscord && (
        <DiscordRedirect action="submit your game" onBack={() => setShowSubmitDiscord(false)} />
      )}
    </div>
  );
}
