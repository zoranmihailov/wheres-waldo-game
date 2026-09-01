import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function LeaderboardModal({ levels = [], currentLevelId, onClose }) {

  const initialLevelId = currentLevelId || (levels.length > 0 ? levels[0].id : null);
  const [selectedLevelId, setSelectedLevelId] = useState(initialLevelId);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedLevelId) return;

    setLoading(true);
    fetch(`${API_URL}/leaderboard/${selectedLevelId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error fetching leaderboard');
        return res.json();
      })
      .then((data) => {
        setScores(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading leaderboard:', err);
        setScores([]);
        setLoading(false);
      });
  }, [selectedLevelId]);

  const formatTime = (sec) => {
    if (isNaN(sec) || sec === null) return '00:00';
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl flex flex-col max-h-[85vh]">

        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h2 className="text-xl font-bold text-white">Leaderboard</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        
        <div className="flex gap-2 py-4 border-b border-slate-800 overflow-x-auto">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevelId(lvl.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedLevelId === lvl.id
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {lvl.title}
            </button>
          ))}
        </div>

        
        <div className="flex-1 overflow-y-auto py-4">
          {loading ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Loading scores...
            </div>
          ) : scores.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No scores saved for this level yet.
            </div>
          ) : (
            <div className="space-y-2">
              {scores.map((score, index) => (
                <div
                  key={score.id || index}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all ${
                    index === 0
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : index === 1
                      ? 'bg-slate-300/10 border-slate-400/30 text-slate-200'
                      : index === 2
                      ? 'bg-amber-700/10 border-amber-700/30 text-amber-500'
                      : 'bg-slate-800/40 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold w-6 text-slate-500">
                      #{index + 1}
                    </span>
                    <span className="font-semibold text-sm">
                      {score.name || score.username}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold text-emerald-400">
                    {formatTime(score.timeInSeconds)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        
        <button
          onClick={onClose}
          className="w-full mt-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}