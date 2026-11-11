import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info, Sparkles, Coffee } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { GameNotification } from '../../types/game';

export const NotificationToasts: React.FC = () => {
  const notifications = useGameStore((state) => state.notifications);
  const clearNotification = useGameStore((state) => state.clearNotification);
  const zenMode = useGameStore((state) => state.zenMode);

  if (zenMode || notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-40 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
      {notifications.map((item) => (
        <ToastItem
          key={item.id}
          item={item}
          onDismiss={() => clearNotification(item.id)}
        />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ item: GameNotification; onDismiss: () => void }> = ({
  item,
  onDismiss,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const duration = item.durationMs || 5000; // Exactly 5000ms

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPercent = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remainingPercent);
      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [item.durationMs]);

  const getStyle = (type: string) => {
    switch (type) {
      case 'coffee':
        return {
          border: 'border-amber-600/50',
          bg: 'bg-gradient-to-r from-amber-950/95 to-stone-900/95',
          text: 'text-amber-100',
          progressBar: 'bg-amber-400',
          icon: <Coffee className="w-4 h-4 text-amber-300" />,
        };
      case 'earn':
        return {
          border: 'border-amber-400/40',
          bg: 'bg-amber-950/90',
          text: 'text-amber-200',
          progressBar: 'bg-amber-400',
          icon: <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />,
        };
      case 'success':
        return {
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-950/90',
          text: 'text-emerald-200',
          progressBar: 'bg-emerald-400',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        };
      case 'warning':
        return {
          border: 'border-rose-500/40',
          bg: 'bg-rose-950/90',
          text: 'text-rose-200',
          progressBar: 'bg-rose-500',
          icon: <AlertCircle className="w-4 h-4 text-rose-400" />,
        };
      default:
        return {
          border: 'border-slate-700/60',
          bg: 'bg-slate-900/90',
          text: 'text-slate-200',
          progressBar: 'bg-sky-400',
          icon: <Info className="w-4 h-4 text-sky-400" />,
        };
    }
  };

  const style = getStyle(item.type);

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden p-3 sm:p-3.5 rounded-2xl border shadow-xl flex items-center justify-between gap-3 text-xs font-semibold backdrop-blur-none transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${style.bg} ${style.border} ${style.text}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex-shrink-0">{style.icon}</span>
        <span className="leading-snug">{item.message}</span>
      </div>

      <button
        onClick={onDismiss}
        className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors flex-shrink-0"
        title="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* 5000ms Auto-hide visual indicator progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/40">
        <div
          className={`h-full transition-all ease-linear ${style.progressBar}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
