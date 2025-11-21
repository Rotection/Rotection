import { useState, useEffect } from 'react';
import { Shield, Search, CheckCircle, Users } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { GameCard } from './components/GameCard';
import { GameDetails } from './components/GameDetails';
import { SubmitGameForm } from './components/SubmitGameForm';
import { FeaturesSection } from './components/FeaturesSection';
import { DiscordRedirect } from './components/DiscordRedirect';
import { motion, AnimatePresence } from 'motion/react';

type View = 'home' | 'browse' | 'submit' | 'game-details';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubmitDiscord, setShowSubmitDiscord] = useState(false);
  const [verifiedGames, setVerifiedGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🚀 Fetch games from your backend
  useEffect(() => {
    const loadGames = async () => {
      try {
        const response = await fetch("https://rotection-bot-production.up.railway.app/api/games");
        const data = await response.json();
        setVerifiedGames(data);
      } catch (err) {
        console.error("Failed to fetch games:", err);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  // Filtering
  const filteredGames = verifiedGames.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGameClick = (game: any) => {
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
        {/* -------------------------------- HOME -------------------------------- */}
        {currentView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Hero onGetStarted={() => setCurrentView('browse')} />
            <FeaturesSection />

            {/* Featured Games */}
            <section className="py-16 px-4">
              <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-purple-600 mb-4 flex justify-center items-center">
                  <Shield className="w-10 h-10 mr-2" />
                  Featured Safe Games
                </h2>
                <p className="text-gray-600 mb-8">
                  These games have been verified by Rotection and loved by players like you!
                </p>

                {loading ? (
                  <p className="text-gray-500">Loading games...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {verifiedGames.slice(0, 3).map((game: any, index: number) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <GameCard game={game} onClick={() => handleGameClick(game)} />
                      </motion.div>
                    ))}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('browse')}
                  className="mt-8 bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700"
                >
                  Browse All Verified Games
                </motion.button>
              </div>
            </section>
          </motion.div>
        )}

        {/* -------------------------------- BROWSE -------------------------------- */}
        {currentView === 'browse' && (
          <motion.section
            key="browse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="py-12 px-4 min-h-screen"
          >
            <div className="max-w-7xl mx-auto">
              <h1 className="text-purple-600 mb-4">Browse Verified Games</h1>

              <div className="relative max-w-2xl mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search games, developers, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-purple-200 focus:border-purple-600"
                />
              </div>

              {loading ? (
                <p className="text-gray-500">Loading games...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGames.map((game: any) => (
                    <GameCard key={game.id} game={game} onClick={() => handleGameClick(game)} />
                  ))}
                </div>
              )}

              {filteredGames.length === 0 && !loading && (
                <p className="text-center text-gray-500 py-12">
                  No games found matching your search.
                </p>
              )}
            </div>
          </motion.section>
        )}

        {/* -------------------------------- GAME DETAILS -------------------------------- */}
        {currentView === 'game-details' && selectedGame && (
          <motion.div
            key="game-details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GameDetails game={selectedGame} onBack={handleBackToBrowse} />
          </motion.div>
        )}

        {/* -------------------------------- SUBMIT GAME -------------------------------- */}
        {currentView === 'submit' && (
          <motion.div
            key="submit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SubmitGameForm onCancel={() => setCurrentView('home')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------- FOOTER -------------------------------- */}
      <footer className="bg-purple-900 text-white py-8 px-4 text-center">
        <Shield className="w-8 h-8 mx-auto mb-2" />
        <p className="text-purple-200">Making Roblox safer, one verified game at a time.</p>
        <p className="text-purple-300 text-sm mt-2">
          © 2025 Rotection
        </p>
      </footer>

      {/* -------------------------------- DISCORD REDIRECT -------------------------------- */}
      {showSubmitDiscord && (
        <DiscordRedirect
          action="submit your game"
          onBack={() => setShowSubmitDiscord(false)}
        />
      )}
    </div>
  );
}
