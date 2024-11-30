import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRightIcon, 
  ChevronDownIcon,
  TrophyIcon,
  ClockIcon,
  ShareIcon,
  MapIcon,
  SparklesIcon,
  FireIcon
} from "@heroicons/react/24/outline";
import Confetti from "react-confetti";
import { useWindowSize } from "usehooks-ts";
import html2canvas from 'html2canvas';

const ConfettiComponent = () => {
  const { width, height } = useWindowSize();
  return <Confetti width={width} height={height} />;
};

const API_BASE = "https://en.wikipedia.org/w/api.php";

function WikipediaGameAdvanced() {
  const [currentTitle, setCurrentTitle] = useState("none");
  const [pageContent, setPageContent] = useState("");
  const [destinationTitle, setDestinationTitle] = useState("none");
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedHeadings, setExpandedHeadings] = useState({});
  const contentRef = useRef(null);

  const challenges = [
    { start: "Banana", end: "Einstein" },
    { start: "Toilet", end: "SpaceX" },
    { start: "Chair", end: "Shark" },
    { start: "Coffee", end: "Mount Everest" },
    { start: "Pineapple", end: "Tesla" },
    { start: "Spider-Man", end: "Carrot" },
    { start: "Jellyfish", end: "Ice Cream" },
    { start: "Pizza", end: "Napoleon" },
    { start: "Candle", end: "Avocado" },
    { start: "Pluto", end: "Cheeseburger" },
    { start: "Supermarket", end: "Beethoven" },
    { start: "Hot Dog", end: "Harry Potter" },
    { start: "Volcano", end: "Toothpaste" },
    { start: "Socks", end: "Barack Obama" },
    { start: "Giraffe", end: "Wi-Fi" },
    { start: "Laptop", end: "Banana Bread" },
    { start: "Pillow", end: "Atlantis" },
    { start: "Robot", end: "Chocolate" },
    { start: "Toothbrush", end: "Moon Landing" },
    { start: "Umbrella", end: "Jazz" },
    { start: "Snowflake", end: "Chernobyl" },
    { start: "Rainbow", end: "Penguin" },
    { start: "Clock", end: "Dinosaur" },
    { start: "Pickle", end: "Hollywood" },
    { start: "Hula Hoop", end: "Eiffel Tower" },
    { start: "Bicycle", end: "Napoleon Dynamite" },
    { start: "Bread", end: "Zeus" },
    { start: "Lightbulb", end: "Sushi" },
    { start: "Microphone", end: "Dragon" },
    { start: "Kangaroo", end: "Instagram" },
    { start: "Suitcase", end: "Plato" },
    { start: "Bubble Wrap", end: "Thor" },
    { start: "Rubber Duck", end: "Chess" },
    { start: "Firetruck", end: "Star Wars" },
    { start: "Potato", end: "Amazon Rainforest" },
    { start: "Watermelon", end: "Super Bowl" },
    { start: "Gloves", end: "Mount Everest" },
    { start: "Spaghetti", end: "Zombie Apocalypse" },
    { start: "Airplane", end: "Toaster" },
    { start: "Cloud", end: "Goldfish" },
    { start: "Cactus", end: "Kryptonite" },
    { start: "Milk", end: "Volcano" },
    { start: "Mushroom", end: "Batman" },
    { start: "Telescope", end: "Cupcake" },
    { start: "Lollipop", end: "Black Hole" },
    { start: "Panda", end: "Internet" },
    { start: "Sponge", end: "Roller Coaster" },
    { start: "Door", end: "Starbucks" },
    { start: "Whale", end: "Rubik's Cube" },
];


  useEffect(() => {
    if (gameStarted) {
      fetchPageContent(currentTitle);
    }
  }, [currentTitle, gameStarted]);

  useEffect(() => {
    let interval = null;
    if (gameStarted && !isGameOver) {
      interval = setInterval(() => setTimer((prev) => prev + 0.01), 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameStarted, isGameOver]);

  const startGame = () => {
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    setPageCount(0);
    setTimer(0);
    setIsGameOver(false);
    setGameStarted(true);
    setNavigationHistory([]);
    setCurrentTitle(randomChallenge.start);
    setDestinationTitle(randomChallenge.end);
  };

  const fetchPageContent = async (title) => {
    setLoading(true);
    try {
      const url = `${API_BASE}?action=parse&page=${title}&format=json&origin=*`;
      const response = await fetch(url);
      const data = await response.json();
      const htmlContent = data.parse.text["*"];
      setPageContent(htmlContent);

      setNavigationHistory((prev) => [...prev, title]);
      setPageCount((prev) => prev + 1);

      if (normalizeTitle(title) === normalizeTitle(destinationTitle)) {
        setIsGameOver(true);
        setGameStarted(false);
      }
    } catch (error) {
      console.error("Error fetching page content:", error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeTitle = (title) => 
    title?.toLowerCase().replace(/_/g, " ").trim();

  const handleLinkClick = (e) => {
    e.preventDefault();
    const url = e.target.getAttribute("href");
    if (url && url.startsWith("/wiki/")) {
      const newTitle = url.replace("/wiki/", "").split("#")[0];
      setCurrentTitle(newTitle);
      
      // Scroll to top of the page
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const toggleExpandHeading = (id) => {
    setExpandedHeadings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const shareAchievement = async () => {
    // Select the game over section for screenshot
    const gameOverSection = document.querySelector('.game-over-section');
    
    if (gameOverSection) {
      try {
        // Use html2canvas to convert the section to an image
        const canvas = await html2canvas(gameOverSection, {
          scale: 2, // Increase resolution
          useCORS: true, // Handle cross-origin images
          logging: false // Disable logging
        });
  
        // Convert canvas to blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve));
  
        // Prepare share data
        const shareData = {
          title: 'Wikipedia Adventure Challenge',
          text: `I completed the Wikipedia Adventure in ${timer.toFixed(2)} seconds across ${pageCount} pages! From ${navigationHistory[0]} to ${destinationTitle}!`,
        };
  
        // Check if Web Share API is supported
        if (navigator.share && navigator.canShare) {
          try {
            await navigator.share({
              ...shareData,
              files: [
                new File([blob], 'wikipedia-adventure-result.png', { type: 'image/png' })
              ]
            });
            console.log('Successfully shared');
          } catch (error) {
            console.log('Error sharing:', error);
            fallbackShare(canvas, shareData);
          }
        } else {
          fallbackShare(canvas, shareData);
        }
      } catch (error) {
        console.error('Error capturing screenshot:', error);
      }
    }
  };
  
  // Fallback sharing method
  const fallbackShare = (canvas, shareData) => {
    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL('image/png');
  
    // Copy to clipboard or download
    if (navigator.clipboard) {
      navigator.clipboard.write([
        new ClipboardItem({
          'image/png': dataUrl
        })
      ]).then(() => {
        alert('Screenshot copied to clipboard! You can now paste it.');
      }).catch(err => {
        console.error('Could not copy image: ', err);
      });
    } else {
      // Fallback to download
      const link = document.createElement('a');
      link.download = 'wikipedia-adventure-result.png';
      link.href = dataUrl;
      link.click();
    }
  };
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sticky Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto shadow-lg fixed left-0 top-0 bottom-0 z-10">
        <div className="sticky top-0 bg-white z-10 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contents</h2>
          
          {/* Game Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs uppercase text-gray-500 mb-1">Current Page</p>
              <p className="font-semibold text-gray-800 truncate">{currentTitle}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs uppercase text-gray-500 mb-1">Destination</p>
              <p className="font-semibold text-gray-800 truncate">{destinationTitle}</p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center">
              <MapIcon className="w-5 h-5 mr-2 text-blue-600" />
              <div>
                <p className="text-xs uppercase text-gray-500">Pages</p>
                <p className="font-semibold text-gray-800">{pageCount}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 text-blue-600" />
              <div>
                <p className="text-xs uppercase text-gray-500">Time</p>
                <p className="font-semibold text-gray-800">{timer.toFixed(2)}s</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Contents List */}
        <ul className="mt-6 space-y-2">
          {pageContent &&
            Array.from(
              new DOMParser()
              .parseFromString(pageContent, "text/html")
              .querySelectorAll("h2, h3")
            ).map((heading, idx) => {
              const level = heading.tagName === "H2" ? "h2" : "h3";
              const id = heading.id || `${level}-${idx}`;
              const isExpandable =
                level === "h2" &&
                heading.nextElementSibling?.querySelectorAll("h3").length > 0;

              return (
                <li 
                  key={idx} 
                  className={`
                    ${level === "h2" 
                      ? "text-gray-900 font-semibold" 
                      : "text-gray-700 pl-4 text-sm"}
                    hover:bg-gray-100 rounded-md transition-colors
                  `}
                >
                  <div className="flex justify-between items-center p-2">
                    <a
                      href={`#${id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(id)?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                      className="flex-grow truncate"
                    >
                      {heading.textContent}
                    </a>
                    {isExpandable && (
                      <button
                        className="text-gray-500 hover:text-blue-600 ml-2"
                        onClick={() => toggleExpandHeading(id)}
                      >
                        {expandedHeadings[id] ? (
                          <ChevronDownIcon className="w-5 h-5" />
                        ) : (
                          <ChevronRightIcon className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>

                  {isExpandable && expandedHeadings[id] && (
                    <ul className="pl-6 space-y-1 pb-2">
                      {Array.from(
                        heading.nextElementSibling?.querySelectorAll("h3") || []
                      ).map((subheading, subIdx) => (
                        <li key={subIdx} className="text-gray-600 text-sm">
                          <a
                            href={`#${subheading.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              document
                                .getElementById(subheading.id)
                                ?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="block p-1 hover:bg-gray-100 rounded-md truncate"
                          >
                            {subheading.textContent}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
        </ul>
      </aside>

      {/* Main Content Area - Shifted to accommodate sticky sidebar */}
      <main className="flex-1 ml-80">
        {/* Header with Larger, More Prominent Page Title */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tl from-cyan-500 via-blue-500 to-purple-600 tracking-tight leading-[1.2]">
            Wikipedia SuperGame!
          </h1>
          <h1 className="text-gray-600 mt-1">
            Made by Itay David
          </h1>
            <p className="text-gray-600 text-lg mt-2">
              Navigate from <span className="font-bold">{currentTitle}</span> to <span className="font-bold">{destinationTitle}</span>
            </p>
          </div>
          <button 
            onClick={startGame}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg 
            hover:bg-blue-700 transition-colors flex items-center"
          >
            {gameStarted ? "Restart Game" : "Start Challenge"}
          </button>
        </header>

        {/* Content Area with Wikipedia-like Styling */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto p-8 bg-white prose prose-blue max-w-none"
        >
          <AnimatePresence>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-pulse w-16 h-16 bg-blue-500 rounded-full"></div>
              </div>
            ) : isGameOver ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20 
                  }
                }}
                className="text-center p-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-2xl overflow-hidden relative game-over-section"
              >
            {/* Confetti Component */}
            <Confetti />

            {/* Animated Achievement Rockets */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                y: [-50, 0, 0, 50],
                transition: {
                  duration: 3,
                  times: [0, 0.2, 0.8, 1],
                  repeat: Infinity
                }
              }}
              className="absolute top-0 left-0 w-full flex justify-between"
            >
              {/* <RocketIcon className="w-16 h-16 text-orange-500 opacity-70" />
              <RocketIcon className="w-16 h-16 text-green-500 opacity-70 rotate-45" /> */}
            </motion.div>

            {/* Animated Trophy with Pulse */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <TrophyIcon className="w-40 h-40 mx-auto text-yellow-500 mb-6 drop-shadow-2xl" />
            </motion.div>

            {/* Exciting Title with Letter Animation */}
            <motion.h2 
              initial={{ opacity: 0, y: -50 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  type: "spring", 
                  stiffness: 120, 
                  delay: 0.3 
                }
              }}
              className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 mb-4 tracking-tight"
            >
              I MEAN... NICE ha?
            </motion.h2>

            {/* Achievement Breakdown with Exciting Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 0.6 }
              }}
              className="bg-white/80 rounded-2xl p-6 max-w-xl mx-auto mb-8 shadow-xl"
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm uppercase text-gray-500">Starting Point</p>
                  <p className="text-2xl font-bold text-blue-700">{navigationHistory[0]}</p>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-500">Destination</p>
                  <p className="text-2xl font-bold text-purple-700">{destinationTitle}</p>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-500">Path Complexity</p>
                  <p className="text-2xl font-bold text-pink-700">{pageCount} Hops</p>
                </div>
              </div>
            </motion.div>

            {/* Detailed Stats with Exciting Display */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  type: "spring", 
                  stiffness: 120, 
                  delay: 0.9 
                }
              }}
              className="flex justify-center space-x-6 mb-8"
            >
              <div className="bg-white/90 p-5 rounded-xl shadow-lg">
                <p className="text-sm uppercase text-gray-500 flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Total Time
                </p>
                <p className="text-4xl font-bold text-blue-600 flex items-center">
                  {timer.toFixed(2)}s
                  <FireIcon className="w-8 h-8 ml-2 text-orange-500" />
                </p>
              </div>
              <div className="bg-white/90 p-5 rounded-xl shadow-lg">
                <p className="text-sm uppercase text-gray-500 flex items-center">
                  <MapIcon className="w-5 h-5 mr-2 text-purple-600" />
                  Pages Traversed
                </p>
                <p className="text-4xl font-bold text-purple-600">{pageCount}</p>
              </div>
            </motion.div>

            {/* Action Buttons with Hover Effects */}
            <div className="flex justify-center space-x-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-xl text-lg"
              >
                <SparklesIcon className="w-6 h-6 mr-3" />
                Play Again!?
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareAchievement}
                className="bg-purple-100 text-purple-800 px-8 py-4 rounded-lg hover:bg-purple-200 flex items-center shadow-xl text-lg"
              >
                <ShareIcon className="w-6 h-6 mr-3" />
                Share Your Win!
              </motion.button>
            </div>
          </motion.div> 
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: pageContent }}
                onClick={handleLinkClick}
                className="wikipedia-content"
              />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default WikipediaGameAdvanced;