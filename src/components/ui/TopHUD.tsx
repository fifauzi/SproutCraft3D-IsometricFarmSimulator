import React from 'react';
import {
  Coins,
  Sun,
  CloudRain,
  Flame,
  Volume2,
  VolumeX,
  Droplets,
  Sparkles,
  Store,
  Eye,
  EyeOff,
  Battery,
  Moon,
  Clock,
  Coffee,
  Lock,
  Unlock,
  AlertTriangle,
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { CROP_CONFIGS } from '../../config/crops';
import { CropType } from '../../types/game';

interface TopHUDProps {
  onOpenShop: () => void;
  onOpenGuide: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({ onOpenShop, onOpenGuide }) => {
  const money = useGameStore((state) => state.money);
  const inventory = useGameStore((state) => state.inventory);
  const fertilizerStock = useGameStore((state) => state.fertilizerStock);
  const bdsCoffeeStock = useGameStore((state) => state.bdsCoffeeStock);
  const drinkBdsCoffee = useGameStore((state) => state.drinkBdsCoffee);
  const timeInMinutes = useGameStore((state) => state.timeInMinutes);
  const day = useGameStore((state) => state.day);
  const weather = useGameStore((state) => state.weather);
  const stamina = useGameStore((state) => state.stamina);
  const maxStamina = useGameStore((state) => state.maxStamina);
  const shackPurchased = useGameStore((state) => state.shackPurchased);
  const sleepInShack = useGameStore((state) => state.sleepInShack);
  const isLeftUnlocked = useGameStore((state) => state.isLeftUnlocked);
  const isRightUnlocked = useGameStore((state) => state.isRightUnlocked);
  const unlockSection = useGameStore((state) => state.unlockSection);
  const cropNeglectActive = useGameStore((state) => state.cropNeglectActive);
  const timeSpeedMultiplier = useGameStore((state) => state.timeSpeedMultiplier);
  const setTimeSpeedMultiplier = useGameStore((state) => state.setTimeSpeedMultiplier);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const zenMode = useGameStore((state) => state.zenMode);
  const toggleZenMode = useGameStore((state) => state.toggleZenMode);
  const harvestAllReady = useGameStore((state) => state.harvestAllReady);
  const waterAllPlots = useGameStore((state) => state.waterAllPlots);
  const plots = useGameStore((state) => state.plots);

  const readyToHarvestCount = plots.filter((p) => p.isUnlocked && p.crop && p.stage === 3).length;
  const dryPlotsCount = plots.filter((p) => p.isUnlocked && p.crop && !p.isMoist).length;

  const formatTime = (totalMins: number) => {
    const hours24 = Math.floor(totalMins / 60) % 24;
    const mins = Math.floor(totalMins % 60);
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const formattedHours = hours12 < 10 ? `0${hours12}` : `${hours12}`;
    const formattedMins = mins < 10 ? `0${mins}` : `${mins}`;
    return `${formattedHours}:${formattedMins} ${period}`;
  };

  const isBedtime = timeInMinutes >= 1200 || timeInMinutes < 120; // 8:00 PM to 2:00 AM
  const isUrgentFaintRisk = timeInMinutes >= 60 && timeInMinutes < 120; // 1:00 AM to 2:00 AM
  const allSectionsUnlocked = isLeftUnlocked && isRightUnlocked;

  if (zenMode) {
    return (
      <div className="absolute top-4 right-4 z-40 pointer-events-auto">
        <button
          onClick={toggleZenMode}
          className="bg-slate-900/80 hover:bg-slate-900 text-white p-2.5 rounded-full shadow-lg border border-slate-700/60 transition-transform active:scale-95 flex items-center gap-2 px-3 text-xs font-medium"
          title="Exit Zen Mode"
        >
          <Eye className="w-4 h-4 text-emerald-400" />
          <span>Exit Zen Mode</span>
        </button>
      </div>
    );
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-30 p-2.5 sm:p-4 pointer-events-none flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 sm:gap-3 max-w-7xl mx-auto w-full">
        {/* Left: Day/Clock HUD, Stamina, BDS Coffee Drinker, Money */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto flex-wrap">
          {/* Clock & Weather Card */}
          <div className="bg-slate-900/90 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-md border border-slate-700/60 flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-base border shadow-inner ${
                weather === 'rainy'
                  ? 'bg-sky-500/20 text-sky-400 border-sky-400/30'
                  : weather === 'heatwave'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-400/30'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30'
              }`}
              title={`Weather: ${weather.toUpperCase()}`}
            >
              {weather === 'rainy' ? (
                <CloudRain className="w-4 h-4 text-sky-400" />
              ) : weather === 'heatwave' ? (
                <Flame className="w-4 h-4 text-amber-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-300" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wide">
                  Day {day}
                </span>
                <span className="text-[10px] text-slate-400">•</span>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {formatTime(timeInMinutes)}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                <span>{weather}</span>
                {weather === 'rainy' && <span className="text-sky-400">(Auto-Watering)</span>}
                {weather === 'heatwave' && <span className="text-amber-400">(2x Fast Dry)</span>}
              </div>
            </div>
          </div>

          {/* Stamina Meter */}
          <div className="bg-slate-900/90 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-md border border-slate-700/60 flex items-center gap-2">
            <Battery
              className={`w-4 h-4 ${
                stamina > 50
                  ? 'text-emerald-400'
                  : stamina > 20
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            />
            <div className="w-14 sm:w-18">
              <div className="flex items-center justify-between text-[10px] font-bold mb-0.5">
                <span className="text-slate-400">Energy</span>
                <span className="text-white">{Math.round(stamina)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-700">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    stamina > 50
                      ? 'bg-emerald-500'
                      : stamina > 20
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${(stamina / maxStamina) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick BDS Coffee Drink Button */}
          <button
            onClick={() => drinkBdsCoffee()}
            className={`px-3 py-1.5 sm:py-2 rounded-2xl shadow-md border flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 ${
              bdsCoffeeStock > 0
                ? 'bg-gradient-to-r from-amber-900 to-stone-900 hover:from-amber-800 hover:to-stone-800 text-amber-200 border-amber-600/50 shadow-amber-950/40'
                : 'bg-slate-900/70 text-slate-500 border-slate-800 opacity-60'
            }`}
            title="Drink BDS Coffee Canned Latte (+50 Stamina)"
          >
            <Coffee className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">BDS Coffee:</span>
            <span className="font-black text-amber-300">{bdsCoffeeStock}</span>
            <span className="text-[10px] text-amber-400/80 hidden md:inline">(+50 Energy)</span>
          </button>

          {/* Money Display */}
          <div className="bg-amber-500/95 hover:bg-amber-500 text-slate-950 font-black px-3.5 py-1.5 sm:py-2 rounded-2xl shadow-md border border-amber-300/40 flex items-center gap-1.5 sm:gap-2">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950 fill-amber-950" />
            <span className="text-xs sm:text-base font-extrabold tracking-tight">
              ${money.toLocaleString()}
            </span>
          </div>

          {/* Farm Shop Button */}
          <button
            onClick={onOpenShop}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-md border border-emerald-400/40 flex items-center gap-1.5 transition-all active:scale-95 text-xs sm:text-sm"
          >
            <Store className="w-4 h-4" />
            <span>Shop</span>
          </button>

          {/* 3-Section Farm Grid Unlock Status Pill */}
          {!allSectionsUnlocked ? (
            <button
              onClick={() => {
                if (day >= 30) {
                  if (!isLeftUnlocked) unlockSection('left');
                  if (!isRightUnlocked) unlockSection('right');
                }
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-all ${
                day >= 30
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-200 animate-pulse active:scale-95'
                  : 'bg-slate-900/80 text-slate-400 border-slate-700/60'
              }`}
              title={day >= 30 ? 'Click to unlock Left & Right farms!' : 'Left and Right sections unlock on Day 30'}
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Expansion: Day {day}/30</span>
              {day >= 30 && <span className="text-emerald-950 font-black">[UNLOCK READY]</span>}
            </button>
          ) : (
            <div className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1">
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              <span>27 Plots Active</span>
            </div>
          )}

          {/* Bedtime Sleep Action (Active after 8 PM) */}
          {isBedtime && shackPurchased && (
            <button
              onClick={() => sleepInShack()}
              className={`font-black px-3 py-1.5 rounded-2xl shadow-md flex items-center gap-1.5 text-xs transition-all active:scale-95 ${
                isUrgentFaintRisk
                  ? 'bg-rose-500 hover:bg-rose-400 text-white border border-rose-300 animate-bounce'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/40'
              }`}
              title="Sleep in Shack until 6:00 AM (restores full stamina)"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Sleep (Shack)</span>
            </button>
          )}

          {cropNeglectActive && (
            <div className="bg-rose-950/90 text-rose-300 border border-rose-600/50 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Neglect Penalty Active (2x Growth Time)</span>
            </div>
          )}
        </div>

        {/* Right: Quick actions, Time speed, Sound, Guide */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Time Speed Multipliers (1x, 2x, 5x) */}
          <div className="bg-slate-900/85 text-slate-300 p-1 rounded-xl shadow-md border border-slate-700/60 hidden sm:flex items-center gap-0.5">
            {[1, 2, 5].map((speed) => (
              <button
                key={speed}
                onClick={() => setTimeSpeedMultiplier(speed)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors ${
                  timeSpeedMultiplier === speed
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'hover:text-white text-slate-400'
                }`}
                title={`Game Speed ${speed}x`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Quick Action: Harvest Ready Badge */}
          {readyToHarvestCount > 0 && (
            <button
              onClick={() => harvestAllReady()}
              className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl shadow-md border border-amber-200 flex items-center gap-1.5 text-xs transition-transform active:scale-95"
              title="Harvest all mature crops"
            >
              <Sparkles className="w-3.5 h-3.5 fill-amber-950" />
              <span>Harvest ({readyToHarvestCount})</span>
            </button>
          )}

          {/* Quick Action: Water All */}
          {dryPlotsCount > 0 && weather !== 'rainy' && (
            <button
              onClick={() => waterAllPlots()}
              className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl shadow-md border border-sky-300/40 flex items-center gap-1.5 text-xs transition-transform active:scale-95"
              title="Water all dry soil plots"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Water All ({dryPlotsCount})</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="bg-slate-900/85 hover:bg-slate-800 text-slate-300 p-2 rounded-xl shadow-md border border-slate-700/60 transition-colors"
            title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Guide / Help */}
          <button
            onClick={onOpenGuide}
            className="bg-slate-900/85 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-xl shadow-md border border-slate-700/60 text-xs font-semibold"
            title="How to Play"
          >
            Help
          </button>

          {/* Zen Mode Button */}
          <button
            onClick={toggleZenMode}
            className="bg-slate-900/85 hover:bg-slate-800 text-slate-300 p-2 rounded-xl shadow-md border border-slate-700/60 transition-colors"
            title="Zen View (Hide UI)"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Inventory Bar */}
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full pointer-events-auto overflow-x-auto py-0.5">
        {/* BDS Coffee pill */}
        <div
          className={`px-2.5 py-1 rounded-xl text-xs flex items-center gap-1.5 border shadow-sm ${
            bdsCoffeeStock > 0
              ? 'bg-amber-950/80 text-amber-100 border-amber-600/40'
              : 'bg-slate-900/40 text-slate-500 border-slate-800/40'
          }`}
        >
          <span>☕</span>
          <span className="font-medium text-amber-300">BDS Coffee:</span>
          <span className={`font-bold ${bdsCoffeeStock > 0 ? 'text-amber-200' : 'text-slate-500'}`}>
            {bdsCoffeeStock} cans (+50 energy)
          </span>
        </div>

        {/* Fertilizer pill */}
        <div
          className={`px-2.5 py-1 rounded-xl text-xs flex items-center gap-1.5 border shadow-sm ${
            fertilizerStock > 0
              ? 'bg-slate-900/90 text-white border-emerald-500/40'
              : 'bg-slate-900/40 text-slate-500 border-slate-800/40'
          }`}
        >
          <span>🧪</span>
          <span className="font-medium text-emerald-400">Fertilizer:</span>
          <span className={`font-bold ${fertilizerStock > 0 ? 'text-emerald-300' : 'text-slate-500'}`}>
            {fertilizerStock} bags (+50% speed)
          </span>
        </div>

        {/* Seed pills */}
        {(Object.keys(inventory) as CropType[]).map((crop) => {
          const count = inventory[crop];
          const conf = CROP_CONFIGS[crop];
          return (
            <div
              key={crop}
              className={`px-2.5 py-1 rounded-xl text-xs flex items-center gap-1.5 border shadow-sm ${
                count > 0
                  ? 'bg-slate-900/80 text-white border-slate-700/60'
                  : 'bg-slate-900/40 text-slate-500 border-slate-800/40'
              }`}
            >
              <span>{conf.icon}</span>
              <span className="font-medium">{conf.name.split(' ')[1] || conf.name}:</span>
              <span className={`font-bold ${count > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </header>
  );
};
