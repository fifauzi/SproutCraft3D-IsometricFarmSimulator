import React, { useState } from 'react';
import {
  X,
  Coins,
  Check,
  Home,
  Coffee,
  FlaskConical,
  Sparkles,
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { CROP_CONFIGS } from '../../config/crops';
import { CropType } from '../../types/game';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ isOpen, onClose }) => {
  const money = useGameStore((state) => state.money);
  const inventory = useGameStore((state) => state.inventory);
  const fertilizerStock = useGameStore((state) => state.fertilizerStock);
  const bdsCoffeeStock = useGameStore((state) => state.bdsCoffeeStock);
  const shackPurchased = useGameStore((state) => state.shackPurchased);
  const shackCost = useGameStore((state) => state.shackCost);
  const buyShack = useGameStore((state) => state.buyShack);
  const buySeed = useGameStore((state) => state.buySeed);
  const buyFertilizer = useGameStore((state) => state.buyFertilizer);
  const buyBdsCoffee = useGameStore((state) => state.buyBdsCoffee);
  const [purchaseFeedback, setPurchaseFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const cropKeys: CropType[] = ['corn', 'carrot', 'wheat', 'pumpkin'];

  const handleBuy = (crop: CropType, count: number) => {
    const success = buySeed(crop, count);
    if (success) {
      setPurchaseFeedback(`Bought ${count}x ${CROP_CONFIGS[crop].seedName}!`);
      setTimeout(() => setPurchaseFeedback(null), 2500);
    }
  };

  const handleBuyFertilizer = (count: number) => {
    const success = buyFertilizer(count);
    if (success) {
      setPurchaseFeedback(`Bought ${count}x Fertilizer Bags!`);
      setTimeout(() => setPurchaseFeedback(null), 2500);
    }
  };

  const handleBuyCoffee = (count: number) => {
    const success = buyBdsCoffee(count);
    if (success) {
      setPurchaseFeedback(`Purchased ${count}x BDS Coffee Canned Latte!`);
      setTimeout(() => setPurchaseFeedback(null), 2500);
    }
  };

  const handleBuyShack = () => {
    const success = buyShack();
    if (success) {
      setPurchaseFeedback('Farm Shack constructed! Safe sleeping & fertilizer storage unlocked.');
      setTimeout(() => setPurchaseFeedback(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-none">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl shadow-inner">
              🏪
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">SproutCraft Market & BDS Coffee</h2>
              <p className="text-xs text-slate-400">
                Official supplier of BDS Coffee, infrastructure, and certified seeds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-amber-400 font-extrabold text-sm">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>${money.toLocaleString()}</span>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback alert */}
        {purchaseFeedback && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-2 text-xs font-bold text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{purchaseFeedback}</span>
          </div>
        )}

        {/* Catalog */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Section 1: BDS Coffee Company Official Showcase */}
          <div className="bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/60 border border-amber-600/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-start gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 border border-amber-300/40 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                ☕
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-amber-100 text-base">BDS Coffee Canned Latte</h3>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-md">
                    BDS Coffee Co.
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                    Owned: {bdsCoffeeStock} cans
                  </span>
                </div>
                <p className="text-xs text-amber-200/80 mt-1 max-w-sm">
                  Signature canned iced latte brewed with slow-roasted beans and fresh velvety milk.
                  Consuming it <strong>instantly restores +50 Stamina</strong>.
                </p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-amber-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+50 Energy on Demand • Smooth Roasted Flavor</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center self-end">
              <button
                onClick={() => handleBuyCoffee(1)}
                disabled={money < 18}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
                  money >= 18
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 shadow-md active:scale-95'
                    : 'bg-slate-800 text-slate-500 border-slate-700/50 cursor-not-allowed opacity-60'
                }`}
              >
                <span>Buy 1 Can</span>
                <span className="font-black">($18)</span>
              </button>
              <button
                onClick={() => handleBuyCoffee(3)}
                disabled={money < 50}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
                  money >= 50
                    ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-400/40 shadow-md active:scale-95'
                    : 'bg-slate-800 text-slate-500 border-slate-700/50 cursor-not-allowed opacity-60'
                }`}
              >
                <span>3-Pack</span>
                <span className="font-black">($50)</span>
              </button>
            </div>
          </div>

          {/* Section 2: Farm Shack Infrastructure */}
          <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                🏠
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-base">Farm Shack & Fertilizer Shed</h3>
                  {shackPurchased ? (
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      Owned & Active
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-md">
                      ${shackCost}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-sm">
                  Sleep between 8:00 PM and 2:00 AM to restore full stamina and prevent the <strong>2:00 AM fainting penalty</strong> (which doubles remaining crop growth time).
                  Includes Fertilizer Storage (+5 free bags + daily restock).
                </p>
              </div>
            </div>

            <div>
              {!shackPurchased ? (
                <button
                  onClick={handleBuyShack}
                  disabled={money < shackCost}
                  className={`px-4 py-2 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 ${
                    money >= shackCost
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-200 shadow-md active:scale-95'
                      : 'bg-slate-800 text-slate-500 border-slate-700/50 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Build Shack (${shackCost})</span>
                </button>
              ) : (
                <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-600/40 px-3 py-1.5 rounded-xl text-center">
                  Ready for Bedtime
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Soil Fertilizer */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                🧪
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-base">Nutrient Soil Fertilizer</h3>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-md">
                    Stock: {fertilizerStock} bags
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Apply to any planted plot to boost growth speed by <strong>+50%</strong>. Lasts until harvest.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center self-end">
              <button
                onClick={() => handleBuyFertilizer(1)}
                disabled={money < 8}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
                  money >= 8
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/40 active:scale-95'
                    : 'bg-slate-800 text-slate-500 border-slate-700/50 cursor-not-allowed opacity-60'
                }`}
              >
                <span>Buy 1 ($8)</span>
              </button>
              <button
                onClick={() => handleBuyFertilizer(5)}
                disabled={money < 38}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
                  money >= 38
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/40 active:scale-95'
                    : 'bg-slate-800 text-slate-500 border-slate-700/50 cursor-not-allowed opacity-60'
                }`}
              >
                <span>Buy 5 ($38)</span>
              </button>
            </div>
          </div>

          {/* Section 4: Certified Crop Seeds */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Crop Seeds
            </h4>

            {cropKeys.map((crop) => {
              const conf = CROP_CONFIGS[crop];
              const owned = inventory[crop];
              const canAfford1 = money >= conf.seedCost;
              const canAfford5 = money >= conf.seedCost * 5;

              return (
                <div
                  key={crop}
                  className="bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/60 rounded-2xl p-3.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-700/70 flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
                      {conf.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-white text-sm">{conf.seedName}</h4>
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-md">
                          Owned: {owned}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm">{conf.description}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                        <span className="text-amber-400 font-bold">Cost: ${conf.seedCost}</span>
                        <span className="text-emerald-400 font-bold">Harvest: ${conf.sellValue}</span>
                        <span className="text-sky-400 font-semibold">~{conf.growthDurationSeconds}s</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center self-end">
                    <button
                      onClick={() => handleBuy(crop, 1)}
                      disabled={!canAfford1}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        canAfford1
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 shadow-sm active:scale-95'
                          : 'bg-slate-800 text-slate-500 border-slate-700/50 cursor-not-allowed opacity-60'
                      }`}
                    >
                      Buy 1 (${conf.seedCost})
                    </button>
                    <button
                      onClick={() => handleBuy(crop, 5)}
                      disabled={!canAfford5}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        canAfford5
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/50 shadow-sm active:scale-95'
                          : 'bg-slate-800 text-slate-500 border-slate-700/50 cursor-not-allowed opacity-60'
                      }`}
                    >
                      Buy 5 (${conf.seedCost * 5})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <span>Official BDS Coffee Canned Latte • Keeps you energized around the clock!</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-white font-bold rounded-xl border border-slate-700/70 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
