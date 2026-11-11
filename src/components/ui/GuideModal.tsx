import React from 'react';
import {
  X,
  Clock,
  Moon,
  CloudRain,
  Coffee,
  Home,
  Lock,
  Scissors,
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xl shadow-inner">
              📖
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">SproutCraft 3D: Guide & Rules</h2>
              <p className="text-xs text-slate-400">Day/Night cycles, 3-section farm, and BDS Coffee</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guide Steps */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 text-xs sm:text-sm">
          {/* Day / Night Cycle */}
          <div className="flex items-start gap-3 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black flex-shrink-0">
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h4 className="font-bold text-white flex items-center gap-1.5">
                Day/Night Cycle (1h in-game = 1 min real-time)
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                The sun and moon dynamically orbit across the sky dome with real-time shadow casting.
                Morning starts at 06:00 AM, sunset at 05:00 PM, and nighttime from 07:30 PM to 05:30 AM.
              </p>
            </div>
          </div>

          {/* Bedtime & Fainting Penalty */}
          <div className="flex items-start gap-3 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black flex-shrink-0">
              <Moon className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h4 className="font-bold text-white flex items-center gap-1.5">
                Bedtime (8:00 PM) & Fainting Penalty (2:00 AM)
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                • <strong>8:00 PM (20:00)</strong>: Standard bedtime begins. Interact with your Farm Shack to sleep until 6:00 AM and fully restore your stamina (100/100).<br />
                • <strong>2:00 AM Cutoff</strong>: If you do not sleep in your Shack by 2:00 AM, you faint on the field! Fainting applies the <strong>Crop Neglect Penalty</strong>, which doubles the remaining growth time for all currently planted crops.
              </p>
            </div>
          </div>

          {/* 3-Section Farm Grid Expansion */}
          <div className="flex items-start gap-3 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black flex-shrink-0">
              <Lock className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h4 className="font-bold text-white flex items-center gap-1.5">
                3-Section Farm Grid (Left, Center, Right)
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                • <strong>Center Farm (9 plots)</strong>: Unlocked and ready from Day 1.<br />
                • <strong>Left & Right Farms (18 plots)</strong>: Protected by 3D Padlocks, unlocking automatically when you reach <strong>Day 30</strong> for a massive 27-plot harvest empire!
              </p>
            </div>
          </div>

          {/* BDS Coffee Stamina System */}
          <div className="flex items-start gap-3 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
            <div className="w-8 h-8 rounded-xl bg-amber-600/20 text-amber-300 flex items-center justify-center font-black flex-shrink-0">
              <Coffee className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h4 className="font-bold text-white flex items-center gap-1.5">
                Stamina & BDS Coffee Canned Latte (+50 Energy)
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Farming actions consume stamina. When running low, drink a canned latte from <strong>BDS Coffee Company</strong> to instantly restore <strong>+50 Stamina</strong>, or sleep in your Shack for full recovery.
              </p>
            </div>
          </div>

          {/* Dynamic Weather */}
          <div className="flex items-start gap-3 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-black flex-shrink-0">
              <CloudRain className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h4 className="font-bold text-white flex items-center gap-1.5">
                Randomized Weather System
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Triggered every morning at 6:00 AM:<br />
                • <strong>Rain (40%)</strong>: Automatically waters all unlocked soil plots continuously.<br />
                • <strong>Heatwave (20%)</strong>: Soil moisture evaporates twice as fast.<br />
                • <strong>Sunny (40%)</strong>: Classic pleasant farming conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-xs"
          >
            Ready to Farm!
          </button>
        </div>
      </div>
    </div>
  );
};
