/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FarmScene } from './components/3d/FarmScene';
import { TopHUD } from './components/ui/TopHUD';
import { ToolDock } from './components/ui/ToolDock';
import { ShopModal } from './components/ui/ShopModal';
import { GuideModal } from './components/ui/GuideModal';
import { SleepOverlay } from './components/ui/SleepOverlay';
import { NotificationToasts } from './components/ui/NotificationToasts';
import { useGameStore } from './store/gameStore';

export default function App() {
  const [shopOpen, setShopOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const toggleZenMode = useGameStore((state) => state.toggleZenMode);
  const setSelectedTool = useGameStore((state) => state.setSelectedTool);
  const harvestAllReady = useGameStore((state) => state.harvestAllReady);
  const waterAllPlots = useGameStore((state) => state.waterAllPlots);
  const sleepInShack = useGameStore((state) => state.sleepInShack);
  const drinkBdsCoffee = useGameStore((state) => state.drinkBdsCoffee);

  // Keyboard shortcut controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 's':
          setShopOpen((prev) => !prev);
          break;
        case 'c':
          drinkBdsCoffee();
          break;
        case 'h':
        case 'z':
          toggleZenMode();
          break;
        case '1':
          setSelectedTool('smart');
          break;
        case '2':
          setSelectedTool('plant');
          break;
        case '3':
          setSelectedTool('fertilize');
          break;
        case '4':
          setSelectedTool('water');
          break;
        case '5':
          setSelectedTool('harvest');
          break;
        case 'w':
          waterAllPlots();
          break;
        case 'l':
          sleepInShack();
          break;
        case ' ':
          harvestAllReady();
          break;
        case 'escape':
          setShopOpen(false);
          setGuideOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleZenMode, setSelectedTool, waterAllPlots, harvestAllReady, sleepInShack, drinkBdsCoffee]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 3D Scene Viewport */}
      <main className="w-full h-full absolute inset-0">
        <FarmScene />
      </main>

      {/* Top HUD with In-Game Clock, Weather, Stamina, BDS Coffee, and Expansion Status */}
      <TopHUD
        onOpenShop={() => setShopOpen(true)}
        onOpenGuide={() => setGuideOpen(true)}
      />

      {/* 5000ms Auto-Hiding Notifications Overlay */}
      <NotificationToasts />

      {/* Collapsible Bottom Tool Dock (Zero Viewport Occlusion) */}
      <ToolDock onOpenShop={() => setShopOpen(true)} />

      {/* Modals & Fullscreen Overlays */}
      <ShopModal isOpen={shopOpen} onClose={() => setShopOpen(false)} />
      <GuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
      <SleepOverlay />
    </div>
  );
}
