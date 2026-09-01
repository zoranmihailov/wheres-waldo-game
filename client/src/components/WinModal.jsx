import { useState } from 'react';

export default function WinModal({ finalTime, onSave, onClose }) {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatTime = (sec) => {
    if (!sec && sec !== 0) return '00:00';
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await onSave(username.trim());
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-1">Congratulations!</h2>
        <p className="text-sm text-slate-400 mb-4">You found all the characters!</p>

        
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 mb-6">
          <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold mb-1">
            Your Time
          </span>
          <span className="font-mono text-3xl font-extrabold text-emerald-400">
            {formatTime(finalTime)}
          </span>
        </div>

        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 text-left font-semibold mb-1">
              Enter a name for the leaderboard:
            </label>
            <input
              type="text"
              required
              maxLength={20}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-all"
            >
              Close
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !username.trim()}
              className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm shadow-lg shadow-rose-500/20 transition-all"
            >
              {isSubmitting ? 'Saving...' : 'Save 🏆'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}