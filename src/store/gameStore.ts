import { create } from 'zustand';
import { CropType, FarmSection, GameNotification, GrowthStage, SoilPlot, ToolType, WeatherType } from '../types/game';
import { CROP_CONFIGS } from '../config/crops';
import { sound } from '../audio/soundEffects';

interface GameState {
  // Player Economy, Inventory & Beverages
  money: number;
  inventory: Record<CropType, number>; // Seed counts
  fertilizerStock: number; // Fertilizer bags
  bdsCoffeeStock: number; // BDS Coffee Canned Latte cans
  harvestedBaskets: Record<CropType, number>; // Total harvested count

  // Infrastructure & Housing
  shackPurchased: boolean;
  shackCost: number;

  // Farm Sections
  isLeftUnlocked: boolean;
  isRightUnlocked: boolean;

  // Time & Day/Night Cycle (1 real second = 1 in-game minute; 60s = 1 in-game hour)
  timeInMinutes: number; // 0 to 1439 (6:00 AM = 360, 20:00 = 1200, 2:00 AM = 120)
  day: number;
  isSleeping: boolean;
  isFainting: boolean;
  cropNeglectActive: boolean; // Doubled remaining time / half efficiency
  timeSpeedMultiplier: number; // 1x, 2x, 5x

  // Weather System
  weather: WeatherType;

  // Stamina System
  stamina: number;
  maxStamina: number;

  // Farm Plots (3 sections: Left (3x3), Center (3x3), Right (3x3) = 27 plots)
  plots: SoilPlot[];

  // Tools & Selections
  selectedTool: ToolType;
  selectedSeed: CropType;
  selectedPlotId: number | null;

  // Aesthetics & UI
  soundEnabled: boolean;
  zenMode: boolean;
  notifications: GameNotification[];
  totalEarned: number;
  totalHarvested: number;
  farmLevel: number;

  // Actions
  setSelectedTool: (tool: ToolType) => void;
  setSelectedSeed: (crop: CropType) => void;
  setSelectedPlotId: (id: number | null) => void;
  setTimeSpeedMultiplier: (mult: number) => void;
  toggleSound: () => void;
  toggleZenMode: () => void;

  // Expansion
  unlockSection: (section: 'left' | 'right') => boolean;

  // BDS Coffee & Stamina
  drinkBdsCoffee: () => boolean;
  buyBdsCoffee: (count?: number) => boolean;

  // Game Loop Actions
  interactWithPlot: (plotId: number) => void;
  plantPlot: (plotId: number, crop?: CropType) => boolean;
  waterPlot: (plotId: number) => boolean;
  fertilizePlot: (plotId: number) => boolean;
  waterAllPlots: () => void;
  harvestPlot: (plotId: number) => boolean;
  harvestAllReady: () => number;

  // Housing & Infrastructure
  buyShack: () => boolean;
  collectFertilizerFromStorage: () => void;
  sleepInShack: () => boolean;
  faintPlayer: () => void;
  setWeather: (w: WeatherType) => void;

  // Shop
  buySeed: (crop: CropType, count?: number) => boolean;
  buyFertilizer: (count?: number) => boolean;
  sellHarvested: (crop: CropType) => void;

  // Tick Engine
  tick: (deltaSeconds: number) => void;
  addNotification: (message: string, type?: GameNotification['type']) => void;
  clearNotification: (id: string) => void;
}

// Generate 3 sections of 3x3 plots (9 plots each = 27 plots total)
function createInitialPlots(): SoilPlot[] {
  const plots: SoilPlot[] = [];
  const sections: { name: FarmSection; unlocked: boolean }[] = [
    { name: 'left', unlocked: false }, // Unlocks on Day 30
    { name: 'center', unlocked: true }, // Unlocked from Day 1
    { name: 'right', unlocked: false }, // Unlocks on Day 30
  ];

  let idCounter = 0;
  sections.forEach((sec) => {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        plots.push({
          id: idCounter++,
          section: sec.name,
          row: r,
          col: c,
          crop: null,
          stage: 0,
          growthProgress: 0,
          isMoist: true,
          moistureLevel: 80,
          lastWateredTime: Date.now(),
          plantedAt: null,
          isFertilized: false,
          isUnlocked: sec.unlocked,
        });
      }
    }
  });

  return plots;
}

export function rollMorningWeather(): WeatherType {
  const rand = Math.random();
  if (rand < 0.4) return 'rainy';
  if (rand < 0.8) return 'sunny';
  return 'heatwave';
}

export const useGameStore = create<GameState>((set, get) => ({
  money: 100, // Starting Money as requested ($100)
  inventory: {
    corn: 2, // Starting Inventory as requested (Corn Seeds: 2)
    carrot: 0,
    wheat: 0,
    pumpkin: 0,
  },
  fertilizerStock: 3,
  bdsCoffeeStock: 1, // 1 free starter can of BDS Coffee Canned Latte!
  harvestedBaskets: {
    corn: 0,
    carrot: 0,
    wheat: 0,
    pumpkin: 0,
  },
  shackPurchased: false,
  shackCost: 150,

  isLeftUnlocked: false,
  isRightUnlocked: false,

  timeInMinutes: 360, // 06:00 AM
  day: 1,
  isSleeping: false,
  isFainting: false,
  cropNeglectActive: false,
  timeSpeedMultiplier: 1,

  weather: 'sunny',
  stamina: 100,
  maxStamina: 100,

  plots: createInitialPlots(),
  selectedTool: 'smart',
  selectedSeed: 'corn',
  selectedPlotId: null,

  soundEnabled: true,
  zenMode: false,
  notifications: [
    {
      id: 'welcome-1',
      message: 'Welcome to SproutCraft 3D! Left & Right farms unlock on Day 30.',
      type: 'info',
      timestamp: Date.now(),
      durationMs: 5000,
    },
  ],
  totalEarned: 0,
  totalHarvested: 0,
  farmLevel: 1,

  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setSelectedSeed: (crop) => set({ selectedSeed: crop }),
  setSelectedPlotId: (id) => set({ selectedPlotId: id }),
  setTimeSpeedMultiplier: (mult) => set({ timeSpeedMultiplier: mult }),

  toggleSound: () => {
    const next = !get().soundEnabled;
    sound.enabled = next;
    set({ soundEnabled: next });
  },

  toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode })),

  // Auto-hide toast notifications after exactly 5000ms
  addNotification: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotif: GameNotification = {
      id,
      message,
      type,
      timestamp: Date.now(),
      durationMs: 5000,
    };

    set((state) => ({
      notifications: [newNotif, ...state.notifications.slice(0, 4)],
    }));

    // Auto-hide after exactly 5000ms (5 seconds)
    setTimeout(() => {
      get().clearNotification(id);
    }, 5000);
  },

  clearNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  // BDS Coffee Canned Latte: Instantly restores +50 stamina
  drinkBdsCoffee: () => {
    const state = get();
    if (state.bdsCoffeeStock <= 0) {
      sound.playAlert();
      get().addNotification('No BDS Coffee left! Buy a canned latte in the shop.', 'warning');
      return false;
    }

    if (state.stamina >= state.maxStamina) {
      sound.playAlert();
      get().addNotification('Your energy is already at 100% full!', 'info');
      return false;
    }

    sound.playCoffee();

    const restoredStamina = Math.min(state.maxStamina, state.stamina + 50);

    set((s) => ({
      bdsCoffeeStock: s.bdsCoffeeStock - 1,
      stamina: restoredStamina,
    }));

    get().addNotification(
      '☕ Drank BDS Coffee Canned Latte! +50 Stamina restored. Smooth & energizing!',
      'coffee'
    );
    return true;
  },

  buyBdsCoffee: (count = 1) => {
    const costPerCan = 18;
    const totalCost = costPerCan * count;
    const currentMoney = get().money;

    if (currentMoney < totalCost) {
      sound.playAlert();
      get().addNotification(
        `Not enough money! Need $${totalCost} for ${count}x BDS Coffee Canned Latte.`,
        'warning'
      );
      return false;
    }

    sound.playCoin();

    set((s) => ({
      money: s.money - totalCost,
      bdsCoffeeStock: s.bdsCoffeeStock + count,
    }));

    get().addNotification(
      `Purchased ${count}x BDS Coffee Canned Latte ($${totalCost})! Keep energized.`,
      'coffee'
    );
    return true;
  },

  // Expansion Unlock: Unlocks Left or Right farm when Day >= 30
  unlockSection: (section) => {
    const state = get();
    if (state.day < 30) {
      sound.playAlert();
      get().addNotification(
        `🔒 ${section.toUpperCase()} Farm is locked until Day 30! (Current: Day ${state.day})`,
        'warning'
      );
      return false;
    }

    sound.playUnlock();

    set((s) => ({
      isLeftUnlocked: section === 'left' ? true : s.isLeftUnlocked,
      isRightUnlocked: section === 'right' ? true : s.isRightUnlocked,
      plots: s.plots.map((p) =>
        p.section === section
          ? {
              ...p,
              isUnlocked: true,
              isMoist: true,
              moistureLevel: 80,
            }
          : p
      ),
    }));

    get().addNotification(
      `🎉 ${section.toUpperCase()} Farm Section unlocked! 9 new plots ready for planting!`,
      'success'
    );
    return true;
  },

  setWeather: (w) => {
    set({ weather: w });
    get().addNotification(`Weather changed to ${w.toUpperCase()}!`, 'info');
  },

  // Buy Shack ($150)
  buyShack: () => {
    const state = get();
    if (state.shackPurchased) {
      get().addNotification('You already own the Farm Shack!', 'info');
      return false;
    }
    if (state.money < state.shackCost) {
      sound.playAlert();
      get().addNotification(
        `Not enough money! Shack costs $${state.shackCost} (You have $${state.money}).`,
        'warning'
      );
      return false;
    }

    sound.playBuild();
    sound.playCoin();

    set((s) => ({
      money: s.money - s.shackCost,
      shackPurchased: true,
      fertilizerStock: s.fertilizerStock + 5,
    }));

    get().addNotification(
      'Farm Shack built! You can now sleep after 8:00 PM and access Fertilizer Storage.',
      'success'
    );
    return true;
  },

  collectFertilizerFromStorage: () => {
    const state = get();
    if (!state.shackPurchased) {
      sound.playAlert();
      get().addNotification('Buy the Shack first to unlock Fertilizer Storage!', 'warning');
      return;
    }
    sound.playFertilize();
    set((s) => ({ fertilizerStock: s.fertilizerStock + 3 }));
    get().addNotification('Retrieved +3 Fertilizer bags from your Shack storage!', 'success');
  },

  // Sleeping in Shack (Standard bedtime 8:00 PM / 20:00 to 2:00 AM)
  sleepInShack: () => {
    const state = get();
    if (!state.shackPurchased) {
      sound.playAlert();
      get().addNotification(
        'You need a Shack to sleep! Buy one in the shop for $150 to avoid fainting at 2:00 AM.',
        'warning'
      );
      return false;
    }

    const mins = state.timeInMinutes;
    const isBedtime = mins >= 1200 || mins < 120;
    if (!isBedtime) {
      sound.playAlert();
      get().addNotification(
        'Too early to sleep! Standard bedtime starts at 8:00 PM (20:00).',
        'info'
      );
      return false;
    }

    sound.playSleep();
    set({ isSleeping: true });

    setTimeout(() => {
      const nextWeather = rollMorningWeather();
      const nextDay = state.day + 1;
      const shouldUnlockSides = nextDay >= 30;

      if (shouldUnlockSides && (!state.isLeftUnlocked || !state.isRightUnlocked)) {
        sound.playUnlock();
      }

      set((s) => ({
        isSleeping: false,
        timeInMinutes: 360, // 06:00 AM next day
        day: nextDay,
        stamina: s.maxStamina, // Full stamina restored
        cropNeglectActive: false,
        weather: nextWeather,
        fertilizerStock: s.fertilizerStock + 1,
        isLeftUnlocked: shouldUnlockSides ? true : s.isLeftUnlocked,
        isRightUnlocked: shouldUnlockSides ? true : s.isRightUnlocked,
        plots: s.plots.map((p) => {
          const unlocked = shouldUnlockSides ? true : p.isUnlocked;
          if (!unlocked || !p.crop || p.stage === 3) {
            return {
              ...p,
              isUnlocked: unlocked,
              moistureLevel: nextWeather === 'rainy' ? 100 : p.moistureLevel,
              isMoist: nextWeather === 'rainy' || p.isMoist,
            };
          }
          const boost = p.isFertilized ? 1.5 : 1.0;
          const nextProg = Math.min(1.0, p.growthProgress + 0.35 * boost);
          let nextStage: GrowthStage = p.stage;
          if (nextProg >= 1.0) nextStage = 3;
          else if (nextProg >= 0.65) nextStage = 2;
          else if (nextProg >= 0.3) nextStage = 1;
          return {
            ...p,
            isUnlocked: unlocked,
            growthProgress: nextProg,
            stage: nextStage,
            moistureLevel: nextWeather === 'rainy' ? 100 : Math.max(25, p.moistureLevel - 20),
            isMoist: nextWeather === 'rainy' || p.moistureLevel > 30,
          };
        }),
      }));

      get().addNotification(
        `Good morning! Day ${nextDay} has arrived. Stamina fully restored (100/100).`,
        'success'
      );

      if (shouldUnlockSides && (!state.isLeftUnlocked || !state.isRightUnlocked)) {
        get().addNotification(
          '🎉 Milestone Day 30 Reached! Left & Right Farm Sections are now UNLOCKED!',
          'earn'
        );
      }

      if (nextWeather === 'rainy') {
        get().addNotification('Rainy weather: All unlocked plots will stay watered today!', 'info');
      } else if (nextWeather === 'heatwave') {
        get().addNotification('Heatwave: Soil moisture dries twice as fast today!', 'warning');
      }
    }, 1200);

    return true;
  },

  // Fainting Penalty (Triggered at 02:00 AM if not in bed)
  faintPlayer: () => {
    const state = get();
    sound.playFaint();
    set({ isFainting: true });

    setTimeout(() => {
      const nextWeather = rollMorningWeather();
      const nextDay = state.day + 1;
      const shouldUnlockSides = nextDay >= 30;

      set((s) => {
        const updatedPlots = s.plots.map((p) => {
          const unlocked = shouldUnlockSides ? true : p.isUnlocked;
          if (!unlocked || !p.crop || p.stage === 3) {
            return {
              ...p,
              isUnlocked: unlocked,
              isMoist: nextWeather === 'rainy' ? true : false,
              moistureLevel: nextWeather === 'rainy' ? 100 : 10,
            };
          }

          // Remaining time is doubled by cutting current progress in half
          const penalizedProg = Math.max(0.05, p.growthProgress * 0.5);
          let penalizedStage: GrowthStage = 0;
          if (penalizedProg >= 1.0) penalizedStage = 3;
          else if (penalizedProg >= 0.65) penalizedStage = 2;
          else if (penalizedProg >= 0.3) penalizedStage = 1;

          return {
            ...p,
            isUnlocked: unlocked,
            growthProgress: penalizedProg,
            stage: penalizedStage,
            isMoist: nextWeather === 'rainy' ? true : false,
            moistureLevel: nextWeather === 'rainy' ? 100 : 10,
          };
        });

        return {
          isFainting: false,
          timeInMinutes: 360, // 06:00 AM next day
          day: nextDay,
          stamina: 50, // Fainted: wake up exhausted at 50% stamina
          cropNeglectActive: true,
          weather: nextWeather,
          isLeftUnlocked: shouldUnlockSides ? true : s.isLeftUnlocked,
          isRightUnlocked: shouldUnlockSides ? true : s.isRightUnlocked,
          plots: updatedPlots,
        };
      });

      get().addNotification(
        'You fainted at 2:00 AM! Crop Neglect Penalty: Remaining crop growth doubled, woke up exhausted (50 Stamina).',
        'warning'
      );
    }, 1600);
  },

  // Smart interaction or tool-based interaction
  interactWithPlot: (plotId) => {
    const state = get();
    const plot = state.plots.find((p) => p.id === plotId);
    if (!plot) return;

    // Check if locked
    if (!plot.isUnlocked) {
      if (state.day >= 30) {
        state.unlockSection(plot.section as 'left' | 'right');
      } else {
        sound.playAlert();
        state.addNotification(
          `🔒 ${plot.section.toUpperCase()} Farm is locked until Day 30! (Current: Day ${state.day}/30)`,
          'warning'
        );
      }
      return;
    }

    const tool = state.selectedTool;

    if (tool === 'water') {
      state.waterPlot(plotId);
    } else if (tool === 'fertilize') {
      state.fertilizePlot(plotId);
    } else if (tool === 'harvest') {
      state.harvestPlot(plotId);
    } else if (tool === 'plant') {
      state.plantPlot(plotId, state.selectedSeed);
    } else {
      // SMART MODE:
      // 1. If mature -> harvest
      if (plot.crop && plot.stage === 3) {
        state.harvestPlot(plotId);
        return;
      }
      // 2. If empty and have seed -> plant selected seed
      if (!plot.crop) {
        const seedCount = state.inventory[state.selectedSeed];
        if (seedCount > 0) {
          state.plantPlot(plotId, state.selectedSeed);
        } else {
          const available = (Object.keys(state.inventory) as CropType[]).find(
            (c) => state.inventory[c] > 0
          );
          if (available) {
            state.setSelectedSeed(available);
            state.plantPlot(plotId, available);
          } else {
            sound.playAlert();
            state.addNotification('No seeds left! Buy more in the Farm Shop.', 'warning');
          }
        }
        return;
      }
      // 3. If planted & unfertilized and has fertilizer -> fertilize!
      if (plot.crop && !plot.isFertilized && state.fertilizerStock > 0) {
        state.fertilizePlot(plotId);
        return;
      }
      // 4. If planted & dry -> water it!
      if (plot.crop && !plot.isMoist) {
        state.waterPlot(plotId);
        return;
      }
      // 5. If planted & growing -> inspect info
      if (plot.crop) {
        sound.playAlert();
        const conf = CROP_CONFIGS[plot.crop];
        const percent = Math.round(plot.growthProgress * 100);
        const fertTag = plot.isFertilized ? ' [Fertilized +50%]' : '';
        state.addNotification(
          `${conf.name}: Stage ${plot.stage + 1}/4 (${percent}% grown)${fertTag}. Keep moist!`,
          'info'
        );
      }
    }
  },

  plantPlot: (plotId, cropType) => {
    const state = get();
    const plot = state.plots.find((p) => p.id === plotId);
    if (!plot || !plot.isUnlocked || plot.crop !== null) {
      return false;
    }

    if (state.stamina < 3) {
      sound.playAlert();
      state.addNotification('Too exhausted to plant! Drink BDS Coffee or sleep to recover energy.', 'warning');
      return false;
    }

    const crop = cropType || state.selectedSeed;
    const seedStock = state.inventory[crop];

    if (seedStock <= 0) {
      sound.playAlert();
      state.addNotification(`Out of ${CROP_CONFIGS[crop].seedName}! Buy more in the shop.`, 'warning');
      return false;
    }

    sound.playPlant();

    set((s) => ({
      stamina: Math.max(0, s.stamina - 3),
      inventory: {
        ...s.inventory,
        [crop]: s.inventory[crop] - 1,
      },
      plots: s.plots.map((p) =>
        p.id === plotId
          ? {
              ...p,
              crop,
              stage: 0,
              growthProgress: 0.05,
              plantedAt: Date.now(),
            }
          : p
      ),
    }));

    get().addNotification(`Planted ${CROP_CONFIGS[crop].seedName}!`, 'success');
    return true;
  },

  waterPlot: (plotId) => {
    const state = get();
    const plot = state.plots.find((p) => p.id === plotId);
    if (!plot || !plot.isUnlocked) return false;

    if (state.stamina < 2) {
      sound.playAlert();
      state.addNotification('Too exhausted to water! Drink BDS Coffee or rest in your shack.', 'warning');
      return false;
    }

    sound.playWater();

    set((s) => ({
      stamina: Math.max(0, s.stamina - 2),
      plots: s.plots.map((p) =>
        p.id === plotId
          ? {
              ...p,
              isMoist: true,
              moistureLevel: 100,
              lastWateredTime: Date.now(),
            }
          : p
      ),
    }));

    get().addNotification('Soil watered! Moisture refreshed.', 'info');
    return true;
  },

  fertilizePlot: (plotId) => {
    const state = get();
    const plot = state.plots.find((p) => p.id === plotId);
    if (!plot || !plot.isUnlocked) return false;

    if (state.fertilizerStock <= 0) {
      sound.playAlert();
      state.addNotification('Out of fertilizer! Buy more in the shop or check Shack storage.', 'warning');
      return false;
    }

    if (plot.isFertilized) {
      sound.playAlert();
      state.addNotification('This plot is already fertilized (+50% growth rate active)!', 'info');
      return false;
    }

    sound.playFertilize();

    set((s) => ({
      fertilizerStock: s.fertilizerStock - 1,
      stamina: Math.max(0, s.stamina - 2),
      plots: s.plots.map((p) =>
        p.id === plotId
          ? {
              ...p,
              isFertilized: true,
            }
          : p
      ),
    }));

    get().addNotification('Fertilizer applied! Growth speed increased by +50%.', 'success');
    return true;
  },

  waterAllPlots: () => {
    const state = get();
    if (state.stamina < 6) {
      sound.playAlert();
      state.addNotification('Not enough stamina to water all plots! Drink BDS Coffee.', 'warning');
      return;
    }
    sound.playWater();
    set((s) => ({
      stamina: Math.max(0, s.stamina - 6),
      plots: s.plots.map((p) =>
        p.isUnlocked
          ? {
              ...p,
              isMoist: true,
              moistureLevel: 100,
              lastWateredTime: Date.now(),
            }
          : p
      ),
    }));
    get().addNotification('All unlocked plots watered!', 'success');
  },

  harvestPlot: (plotId) => {
    const state = get();
    const plot = state.plots.find((p) => p.id === plotId);
    if (!plot || !plot.isUnlocked || !plot.crop || plot.stage !== 3) {
      if (plot?.crop) {
        sound.playAlert();
        state.addNotification('Crop is still growing! Give it a moment to mature.', 'warning');
      }
      return false;
    }

    const crop = plot.crop;
    const cropConf = CROP_CONFIGS[crop];
    const earnAmount = cropConf.sellValue;

    sound.playHarvest();

    set((s) => {
      const nextTotalHarvested = s.totalHarvested + 1;
      const nextLevel = Math.floor(nextTotalHarvested / 5) + 1;
      return {
        stamina: Math.max(0, s.stamina - 1),
        money: s.money + earnAmount,
        totalEarned: s.totalEarned + earnAmount,
        totalHarvested: nextTotalHarvested,
        farmLevel: nextLevel,
        harvestedBaskets: {
          ...s.harvestedBaskets,
          [crop]: s.harvestedBaskets[crop] + 1,
        },
        plots: s.plots.map((p) =>
          p.id === plotId
            ? {
                ...p,
                crop: null,
                stage: 0,
                growthProgress: 0,
                plantedAt: null,
                isFertilized: false,
                moistureLevel: Math.max(20, p.moistureLevel - 15),
                isMoist: p.moistureLevel > 30,
              }
            : p
        ),
      };
    });

    state.addNotification(`Harvested ${cropConf.name}! +$${earnAmount}`, 'earn');
    return true;
  },

  harvestAllReady: () => {
    const readyPlots = get().plots.filter((p) => p.isUnlocked && p.crop && p.stage === 3);
    if (readyPlots.length === 0) {
      sound.playAlert();
      get().addNotification('No crops are ready for harvest yet!', 'info');
      return 0;
    }

    let harvestedCount = 0;
    readyPlots.forEach((p) => {
      get().harvestPlot(p.id);
      harvestedCount++;
    });
    return harvestedCount;
  },

  buySeed: (crop, count = 1) => {
    const conf = CROP_CONFIGS[crop];
    const totalCost = conf.seedCost * count;
    const currentMoney = get().money;

    if (currentMoney < totalCost) {
      sound.playAlert();
      get().addNotification(`Not enough money! Need $${totalCost} for ${count}x ${conf.seedName}.`, 'warning');
      return false;
    }

    sound.playCoin();

    set((state) => ({
      money: state.money - totalCost,
      inventory: {
        ...state.inventory,
        [crop]: state.inventory[crop] + count,
      },
    }));

    get().addNotification(`Purchased ${count}x ${conf.seedName} for $${totalCost}!`, 'success');
    return true;
  },

  buyFertilizer: (count = 1) => {
    const costPerBag = 8;
    const totalCost = costPerBag * count;
    const currentMoney = get().money;

    if (currentMoney < totalCost) {
      sound.playAlert();
      get().addNotification(`Not enough money! Need $${totalCost} for ${count}x Fertilizer.`, 'warning');
      return false;
    }

    sound.playCoin();

    set((state) => ({
      money: state.money - totalCost,
      fertilizerStock: state.fertilizerStock + count,
    }));

    get().addNotification(`Purchased ${count}x Fertilizer bags for $${totalCost}!`, 'success');
    return true;
  },

  sellHarvested: (crop) => {
    const count = get().harvestedBaskets[crop];
    if (count <= 0) return;
    const value = CROP_CONFIGS[crop].sellValue * count;
    sound.playCoin();
    set((s) => ({
      money: s.money + value,
      harvestedBaskets: {
        ...s.harvestedBaskets,
        [crop]: 0,
      },
    }));
    get().addNotification(`Sold ${count}x ${CROP_CONFIGS[crop].name} for $${value}!`, 'earn');
  },

  // Game Loop Tick (1 real second = 1 in-game minute)
  tick: (deltaSeconds) => {
    const cappedDelta = Math.min(deltaSeconds, 0.5);
    const state = get();

    if (state.isSleeping || state.isFainting) return;

    const mult = state.timeSpeedMultiplier;
    const minuteIncrement = cappedDelta * mult;
    const prevTime = state.timeInMinutes;
    const nextTime = (prevTime + minuteIncrement) % 1440;

    // Check for Fainting threshold: 02:00 AM (120 minutes)
    if (prevTime < 120 && nextTime >= 120 && prevTime >= 60) {
      get().faintPlayer();
      return;
    }

    // Bedtime & Late night warnings
    if (prevTime < 1200 && nextTime >= 1200) {
      get().addNotification("It's 8:00 PM (20:00)! Standard bedtime. Return to your Shack to sleep.", 'info');
    } else if (prevTime < 60 && nextTime >= 60) {
      get().addNotification("It's 1:00 AM! You will faint if not asleep by 2:00 AM.", 'warning');
    }

    const isRainy = state.weather === 'rainy';
    const moistureDecayRate = state.weather === 'heatwave' ? 4.0 : 2.0;

    set((curr) => {
      let anyPlotChanged = false;

      const updatedPlots = curr.plots.map((plot) => {
        // If plot is locked, keep static
        if (!plot.isUnlocked) return plot;

        let nextMoisture = isRainy
          ? 100
          : Math.max(0, plot.moistureLevel - cappedDelta * moistureDecayRate);
        const nextIsMoist = isRainy || nextMoisture > 15;

        if (!plot.crop) {
          if (Math.abs(plot.moistureLevel - nextMoisture) > 0.05) {
            anyPlotChanged = true;
            return {
              ...plot,
              moistureLevel: nextMoisture,
              isMoist: nextIsMoist,
            };
          }
          return plot;
        }

        if (plot.stage === 3) {
          return {
            ...plot,
            moistureLevel: nextMoisture,
            isMoist: nextIsMoist,
          };
        }

        const moistureMultiplier = nextIsMoist ? 1.0 : 0.2;
        const fertilizerMultiplier = plot.isFertilized ? 1.5 : 1.0;
        const neglectMultiplier = curr.cropNeglectActive ? 0.5 : 1.0;

        const effectiveMultiplier =
          moistureMultiplier * fertilizerMultiplier * neglectMultiplier;

        const config = CROP_CONFIGS[plot.crop];
        const growthIncrement =
          (cappedDelta / config.growthDurationSeconds) * effectiveMultiplier;

        const nextProgress = Math.min(1.0, plot.growthProgress + growthIncrement);

        let nextStage: GrowthStage = 0;
        if (nextProgress >= 1.0) {
          nextStage = 3;
        } else if (nextProgress >= 0.65) {
          nextStage = 2;
        } else if (nextProgress >= 0.3) {
          nextStage = 1;
        } else {
          nextStage = 0;
        }

        anyPlotChanged = true;
        return {
          ...plot,
          moistureLevel: nextMoisture,
          isMoist: nextIsMoist,
          growthProgress: nextProgress,
          stage: nextStage,
        };
      });

      return {
        timeInMinutes: nextTime,
        plots: anyPlotChanged ? updatedPlots : curr.plots,
      };
    });
  },
}));
