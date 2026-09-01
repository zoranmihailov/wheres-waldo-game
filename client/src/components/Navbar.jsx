import { useState, useEffect } from 'react';

export default function Navbar({ characters = [], foundCharacters = [], isGameOver = false, onOpenLeaderboard }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (isGameOver) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver]);

  useEffect(() => {
    setSeconds(0);
  }, [characters]);

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingCount = (characters?.length || 0) - (foundCharacters?.length || 0);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800/80 px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-rose-500/20">
            W
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Where's Waldo?
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Remaining: <span className="text-rose-400 font-bold">{remainingCount}</span> of {characters.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-4 py-1.5 rounded-xl">
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Time:</span>
            <span className="font-mono font-bold text-emerald-400 text-lg">{formatTime(seconds)}</span>
          </div>

          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition-all"
          >
            <span>🏆</span>
            <span>Leaderboard</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {characters.map((char) => {
            const isFound = foundCharacters.includes(char.id);
            return (
              <div
                key={char.id}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                  isFound
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 opacity-50 grayscale'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:border-slate-500 shadow-sm'
                }`}
              >
                <div className="relative">
                  <img
                    src={char.imageUrl}
                    alt={char.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-700"
                  />
                  {isFound && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] text-slate-950 font-black">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold tracking-wide pr-1">
                  {char.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}