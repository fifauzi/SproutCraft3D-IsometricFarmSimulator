export type CropType = 'corn' | 'carrot' | 'wheat' | 'pumpkin';

export type GrowthStage = 0 | 1 | 2 | 3; // 0: Seedling, 1: Sprout, 2: Growing, 3: Mature

export type WeatherType = 'sunny' | 'rainy' | 'heatwave';

export type FarmSection = 'left' | 'center' | 'right';

export interface CropConfig {
  id: CropType;
  name: string;
  seedName: string;
  seedCost: number;
  sellValue: number;
  growthDurationSeconds: number; // base real-world seconds to mature
  color: string;
  accentColor: string;
  icon: string;
  description: string;
}

export interface SoilPlot {
  id: number;
  section: FarmSection;
  row: number;
  col: number;
  crop: CropType | null;
  stage: GrowthStage;
  growthProgress: number; // 0.0 to 1.0
  isMoist: boolean;
  moistureLevel: number; // 0 to 100
  lastWateredTime: number;
  plantedAt: number | null;
  isFertilized: boolean;
  isUnlocked: boolean;
}

export type ToolType = 'smart' | 'plant' | 'water' | 'fertilize' | 'harvest';

export interface GameNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'earn' | 'coffee';
  timestamp: number;
  durationMs: number; // Exactly 5000ms
}
