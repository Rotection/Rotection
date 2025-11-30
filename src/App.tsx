import { useState, useEffect } from 'react';
import { Shield, Search, Star, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { GameCard } from './components/GameCard';
import { GameDetails } from './components/GameDetails';
import { SubmitGameForm } from './components/SubmitGameForm';
import { FeaturesSection } from './components/FeaturesSection';
import { DiscordRedirect } from './components/DiscordRedirect';
import { motion, AnimatePresence } from 'motion/react';

// Mock data for verified games
const verifiedGames = [
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
    description: `Speedsters Sandbox.\nFind universal skins around the map from different games/animes/shows etc.\nrace other players and have fun!`,
    category: 'Sandbox',
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
    category: 'Party & Casual',
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
    category: 'Action RPG',
  },
];

type View = 'home' | 'browse' | 'submit' | 'game-details';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedGame, setSelectedGame] = useState<typeof verifiedGames[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubmitDiscord, setShowSubmitDiscord] = useState(false);

  // Filtered games based on search
  const filteredGames = verifiedGames.filter(
    game =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGameClick = (game: typeof verifiedGames[0]) => {
    setSelectedGame(game);
    setCurrentView('game-details');
  };

  const handleBackToBrowse = () => {
    setCurrentView('browse');
    setSelectedGame(null);
  };

  // Reset scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* HEADER ALWAYS VISIBLE */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onSubmitGame={() => setShowSubmitDiscord(true)}
      />

      {/* MAIN CONTENT */}
      <AnimatePresence mode="wait">
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
              <div className="max-w-7xl mx-auto text-center mb-12">
                <h2 className="text-purple-600 mb-4">
                  <Shield className="inline-block w-10 h-10 mr-2" />
                  Featured Safe Games
                </h2>
                <p className="text-gray-600">
                  These games have been verified by Rotection and loved by players like you!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {verifiedGames.slice(0, 3).map((game, index) => (
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

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView('browse')}
                  className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors"
                >
                  Browse All Verified Games
                </motion.button>
              </div>
            </section>
          </motion.div>
        )}

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
              <div className="mb-8 relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search games, developers, or categories..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-purple-200 focus:border-purple-600 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      layout
                    >
                      <GameCard game={game} onClick={() => handleGameClick(game)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No games found matching your search.
                </div>
              )}
            </div>
          </motion.section>
        )}

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

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 mr-2" />
            <span className="text-xl">Rotection</span>
          </div>
          <p className="text-purple-200 mb-4">
            Making Roblox safer, one verified game at a time.
          </p>
          <p className="text-purple-300 text-sm">
            © 2025 Rotection. Helping players find safe and fun games.
          </p>
        </div>
      </footer>

      {/* Submit Game Discord Redirect */}
      {showSubmitDiscord && (
        <DiscordRedirect action="submit your game" onBack={() => setShowSubmitDiscord(false)} />
      )}
    </div>
  );
}
