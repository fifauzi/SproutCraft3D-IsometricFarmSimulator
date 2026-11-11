import React, { useState } from 'react';
import {
  Sparkles,
  Droplets,
  Sprout,
  Store,
  ChevronDown,
  ChevronUp,
  MousePointer,
  Scissors,
  FlaskConical,
  Moon,
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { CROP_CONFIGS } from '../../config/crops';
import { CropType, ToolType } from '../../types/game';

interface ToolDockProps {
  onOpenShop: () => void;
}

export const ToolDock: React.FC<ToolDockProps> = ({ onOpenShop }) => {
  const [collapsed, setCollapsed] = useState(false);
  const selectedTool = useGameStore((state) => state.selectedTool);
  const setSelectedTool = useGameStore((state) => state.setSelectedTool);
  const selectedSeed = useGameStore((state) => state.selectedSeed);
  const setSelectedSeed = useGameStore((state) => state.setSelectedSeed);
  const inventory = useGameStore((state) => state.inventory);
  const fertilizerStock = useGameStore((state) => state.fertilizerStock);
  const waterAllPlots = useGameStore((state) => state.waterAllPlots);
  const shackPurchased = useGameStore((state) => state.shackPurchased);
  const sleepInShack = useGameStore((state) => state.sleepInShack);
  const timeInMinutes = useGameStore((state) => state.timeInMinutes);
  const zenMode = useGameStore((state) => state.zenMode);

  if (zenMode) return null;

  const isBedtime = timeInMinutes >= 1200 || timeInMinutes < 120; // 8 PM to 2 AM

  const tools: { id: ToolType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'smart',
      label: 'Smart Auto',
      icon: <MousePointer className="w-4 h-4" />,
      desc: 'Plant, fertilize, water, or harvest with 1 click',
    },
    {
      id: 'plant',
      label: 'Plant',
      icon: <Sprout className="w-4 h-4" />,
      desc: 'Plant selected seed',
    },
    {
      id: 'fertilize',
      label: `Fertilize (${fertilizerStock})`,
      icon: <FlaskConical className="w-4 h-4 text-emerald-400" />,
      desc: 'Apply fertilizer for +50% growth speed boost',
    },
    {
      id: 'water',
      label: 'Water Can',
      icon: <Droplets className="w-4 h-4" />,
      desc: 'Moisten dry soil',
    },
    {
      id: 'harvest',
      label: 'Harvest',
      icon: <Scissors className="w-4 h-4" />,
      desc: 'Gather mature crops',
    },
  ];

  const cropKeys: CropType[] = ['corn', 'carrot', 'wheat', 'pumpkin'];

  return (
    <div
      className="fixed z-30 transition-all duration-300 ease-out pointer-events-auto"
      style={{
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 'min(960px, 94vw)',
        width: 'max-content',
      }}
    >
      {/* Collapse / Expand Tab */}
      <div className="flex justify-center -mb-2 relative z-10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1 rounded-t-xl text-xs font-semibold border-t border-x border-slate-700/60 shadow-md flex items-center gap-1.5 transition-colors"
        >
          {collapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Show Farm Tools</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Hide Dock</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container */}
      {!collapsed && (
        <div className="bg-slate-900/95 text-white p-2.5 sm:p-3 rounded-2xl border border-slate-700/70 shadow-2xl flex flex-col gap-2.5">
          {/* Top row: Tool Selection & Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
            {/* Tool Selection Group */}
            <div className="bg-slate-800/80 p-1 rounded-xl flex items-center gap-1 border border-slate-700/50 flex-wrap">
              {tools.map((tool) => {
                const isActive = selectedTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                    }`}
                    title={tool.desc}
                  >
                    {tool.icon}
                    <span>{tool.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="h-6 w-px bg-slate-700/60 hidden sm:block" />

            {/* Quick Actions */}
            <button
              onClick={() => waterAllPlots()}
              className="bg-sky-600/80 hover:bg-sky-600 text-white px-3 py-2 rounded-xl text-xs font-bold border border-sky-400/30 shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              title="Water all soil plots at once"
            >
              <Droplets className="w-4 h-4 text-sky-200" />
              <span>Water All</span>
            </button>

            {/* Bedtime Sleep button if in shack range */}
            {isBedtime && shackPurchased && (
              <button
                onClick={() => sleepInShack()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl text-xs font-bold border border-indigo-400/40 shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
                title="Sleep in Shack until 6:00 AM (restores full stamina)"
              >
                <Moon className="w-4 h-4 text-indigo-200" />
                <span>Sleep in Shack</span>
              </button>
            )}

            <button
              onClick={onOpenShop}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs border border-amber-300/40 shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Store className="w-4 h-4 text-slate-950" />
              <span>Shop & Shack</span>
            </button>
          </div>

          {/* Bottom row: Crop Seed Selector */}
          <div className="flex items-center justify-center gap-2 pt-1 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
              Selected Seed:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {cropKeys.map((crop) => {
                const conf = CROP_CONFIGS[crop];
                const count = inventory[crop];
                const isSelected = selectedSeed === crop;

                return (
                  <button
                    key={crop}
                    onClick={() => {
                      setSelectedSeed(crop);
                      if (selectedTool !== 'smart' && selectedTool !== 'plant') {
                        setSelectedTool('plant');
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-400/40'
                        : count > 0
                        ? 'bg-slate-800/90 text-slate-200 border-slate-700/60 hover:bg-slate-700'
                        : 'bg-slate-800/40 text-slate-500 border-slate-800/40 hover:bg-slate-800/70'
                    }`}
                  >
                    <span className="text-sm">{conf.icon}</span>
                    <span>{conf.name.split(' ')[1] || conf.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                        isSelected
                          ? 'bg-amber-950/20 text-slate-900'
                          : count > 0
                          ? 'bg-slate-700 text-amber-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      x{count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
