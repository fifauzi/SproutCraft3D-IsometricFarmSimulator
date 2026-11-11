import { CropConfig, CropType } from '../types/game';

export const CROP_CONFIGS: Record<CropType, CropConfig> = {
  corn: {
    id: 'corn',
    name: 'Sweet Corn',
    seedName: 'Corn Seeds',
    seedCost: 10,
    sellValue: 25,
    growthDurationSeconds: 12, // 12 seconds full cycle (3s per stage)
    color: '#eab308', // Amber-500
    accentColor: '#16a34a', // Green-600
    icon: '🌽',
    description: 'Crisp and juicy golden corn ears. A reliable farm staple.',
  },
  carrot: {
    id: 'carrot',
    name: 'Crisp Carrot',
    seedName: 'Carrot Seeds',
    seedCost: 15,
    sellValue: 38,
    growthDurationSeconds: 16,
    color: '#f97316',
    accentColor: '#22c55e',
    icon: '🥕',
    description: 'Bright orange and packed with crunch. Fast-growing and nutritious.',
  },
  wheat: {
    id: 'wheat',
    name: 'Golden Wheat',
    seedName: 'Wheat Seeds',
    seedCost: 8,
    sellValue: 20,
    growthDurationSeconds: 10,
    color: '#ca8a04',
    accentColor: '#84cc16',
    icon: '🌾',
    description: 'Hardy grain that sways gracefully in the summer breeze.',
  },
  pumpkin: {
    id: 'pumpkin',
    name: 'Autumn Pumpkin',
    seedName: 'Pumpkin Seeds',
    seedCost: 25,
    sellValue: 65,
    growthDurationSeconds: 22,
    color: '#ea580c',
    accentColor: '#15803d',
    icon: '🎃',
    description: 'Prized heavy gourds that fetch a handsome price at the market.',
  },
};
