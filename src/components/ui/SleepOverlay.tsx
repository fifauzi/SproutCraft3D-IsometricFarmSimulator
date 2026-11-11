import React from 'react';
import { Moon, Sun, AlertTriangle, Sparkles } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const SleepOverlay: React.FC = () => {
  const isSleeping = useGameStore((state) => state.isSleeping);
  const isFainting = useGameStore((state) => state.isFainting);
  const day = useGameStore((state) => state.day);

  if (!isSleeping && !isFainting) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 text-white transition-opacity duration-500 animate-in fade-in">
      {isSleeping && (
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-3xl animate-bounce">
            🌙
          </div>
          <h2 className="text-2xl font-black text-indigo-300">Fast Asleep in the Shack...</h2>
          <p className="text-sm text-slate-400">
            Recovering stamina and advancing to Day {day + 1} (06:00 AM).
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 py-1.5 px-3 rounded-full border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Stamina fully restored to 100/100</span>
          </div>
        </div>
      )}

      {isFainting && (
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-3xl">
            😵
          </div>
          <h2 className="text-2xl font-black text-rose-400">Fainted on the Field!</h2>
          <p className="text-sm text-slate-300">
            You collapsed from exhaustion at 2:00 AM without sleeping in your Shack.
          </p>
          <div className="bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs p-3 rounded-2xl space-y-1">
            <div className="font-bold flex items-center justify-center gap-1.5 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Crop Neglect Penalty Applied</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Remaining growth time for planted crops has doubled. Waking up at 6:00 AM with 50% stamina.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
