import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ImageArea from "./components/ImageArea";
import WinModal from "./components/WinModal";
import LeaderboardModal from "./components/LeaderboardModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function App() {
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [foundCharacters, setFoundCharacters] = useState([]);
  const [toast, setToast] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const [isGameOver, setIsGameOver] = useState(false);
  const [finalTime, setFinalTime] = useState(null);

  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/images`)
      .then((res) => res.json())
      .then((data) => {
        setLevels(data);
        if (data.length > 0) {
          startLevel(data[0].id);
        }
      })
      .catch((err) => console.error("Connection error:", err));
  }, []);

  const startLevel = async (levelId) => {
    try {
      const res = await fetch(`${API_URL}/game/${levelId}/start`);
      const data = await res.json();
      setCurrentLevel(data);
      setFoundCharacters([]);
      setIsGameOver(false);
      setFinalTime(null);
      setStartTime(Date.now());
    } catch (err) {
      console.error("Error loading level:", err);
    }
  };


  const handleValidate = async (characterId, xPercent, yPercent) => {
    try {
      const response = await fetch(`${API_URL}/game/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterId, xPercent, yPercent }),
      });

      const data = await response.json();

      if (data.correct) {
        const updatedFound = [...foundCharacters, characterId];
        setFoundCharacters(updatedFound);
        showToast("You found the character! 🎉", "success");

        if (updatedFound.length === currentLevel.characters.length) {
          finishGame();
        }
      } else {
        showToast("Missed, try again! ❌", "error");
      }
    } catch (err) {
      showToast("Error during validation", "error");
    }
  };

  const finishGame = () => {
    if (!startTime) return;
    const timeInSeconds = Math.round((Date.now() - startTime) / 1000);
    setFinalTime(timeInSeconds);
    setIsGameOver(true);
  };

  const handleSaveScore = async (username) => {
    try {
      const res = await fetch(`${API_URL}/leaderboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: username,
          timeInSeconds: finalTime,
          imageId: currentLevel.id,
        }),
      });

      if (res.ok) {
        showToast("Score saved! 🏆", "success");
        setIsGameOver(false);
        setShowLeaderboard(true);
      } else {
        showToast("Error saving score", "error");
      }
    } catch (err) {
      showToast("Connection error", "error");
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!currentLevel) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans">
        Loading levels from the database...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        characters={currentLevel.characters}
        foundCharacters={foundCharacters}
        isGameOver={isGameOver}
        onOpenLeaderboard={() => setShowLeaderboard(true)}
      />

      
      <div className="flex justify-center gap-3 py-3 bg-slate-900/50 border-b border-slate-800">
        {levels.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => startLevel(lvl.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentLevel.id === lvl.id
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {lvl.title}
          </button>
        ))}
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 flex items-center gap-3 ${
            toast.type === "success"
              ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-200"
              : toast.type === "error"
                ? "bg-rose-950/80 border-rose-500/50 text-rose-200"
                : "bg-indigo-950/80 border-indigo-500/50 text-indigo-200"
          }`}
        >
          <span className="text-sm font-medium tracking-wide">
            {toast.message}
          </span>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <ImageArea
          imageUrl={currentLevel.imageUrl}
          characters={currentLevel.characters}
          foundCharacters={foundCharacters}
          onValidate={handleValidate}
        />
      </main>

    
      {isGameOver && (
        <WinModal
          finalTime={finalTime}
          onSave={handleSaveScore}
          onClose={() => setIsGameOver(false)}
        />
      )}

      
      {showLeaderboard && (
        <LeaderboardModal
          levels={levels}
          currentLevelId={currentLevel.id}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
}