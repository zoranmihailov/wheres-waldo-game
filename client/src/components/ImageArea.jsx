import { useState } from 'react';

export default function ImageArea({ imageUrl, characters, foundCharacters, onValidate }) {
  const [clickMenu, setClickMenu] = useState(null);

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();

    const xPercent = Number((((e.clientX - rect.left) / rect.width) * 100).toFixed(2));
    const yPercent = Number((((e.clientY - rect.top) / rect.height) * 100).toFixed(2));

    console.log(`📍 Coordinates for seed.js -> xMin: ${xPercent - 2}, xMax: ${xPercent + 2}, yMin: ${yPercent - 2}, yMax: ${yPercent + 2}`);

    const pxX = e.clientX - rect.left;
    const pxY = e.clientY - rect.top;

    setClickMenu({ pxX, pxY, xPercent, yPercent });
  };

  const handleSelect = (characterId) => {
    if (!clickMenu) return;
    onValidate(characterId, clickMenu.xPercent, clickMenu.yPercent);
    setClickMenu(null);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto my-6 px-4 select-none">
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <img
          src={imageUrl}
          alt="Waldo Canvas"
          onClick={handleImageClick}
          className="w-full h-auto block cursor-crosshair transition-opacity duration-300"
        />

      
        {clickMenu && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            style={{ top: `${clickMenu.pxY}px`, left: `${clickMenu.pxX}px` }}
          >
            
            <div className="relative flex items-center justify-center w-14 h-14">
              <span className="absolute inset-0 rounded-full border-2 border-rose-500 animate-ping opacity-75" />
              <div className="w-12 h-12 rounded-full border-2 border-rose-400 bg-rose-500/10 backdrop-blur-[2px] shadow-lg shadow-rose-500/30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              </div>
            </div>

            
            <div className="pointer-events-auto absolute top-16 left-1/2 -translate-x-1/2 w-40 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden py-1">
              <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-800">
                Who is this character?
              </div>
              {characters
                .filter((c) => !foundCharacters.includes(c.id))
                .map((char) => (
                  <button
                    key={char.id}
                    onClick={() => handleSelect(char.id)}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-rose-500 hover:text-white transition-colors duration-150 flex items-center gap-2"
                  >
                    <img
                      src={char.imageUrl}
                      alt={char.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    {char.name}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}