/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface HeaderProps {
  currentLayer: number; // 0, 1, 2, 3, or 4 (ending)
  unlockedCount: number;
  totalEndings: number;
  onOpenNotes: () => void;
  onRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLayer,
  unlockedCount,
  totalEndings,
  onOpenNotes,
  onRestart,
}) => {
  const stepLabel =
    currentLayer >= 4
      ? 'REFLECTION // THE GATHERING ENDS'
      : `SCENARIO ${currentLayer + 1} OF 4`;

  return (
    <header className="w-full border-b border-black bg-white px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="font-mono text-xs font-semibold tracking-widest uppercase text-black">
            A Small Room
          </span>
          <span className="font-mono text-[11px] tracking-wider text-neutral-600">
            {stepLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenNotes}
            className="border border-black bg-white px-2.5 py-1.5 font-mono text-[11px] tracking-wider uppercase text-black transition-colors hover:bg-black hover:text-white active:scale-95"
            aria-label="View ending collection and conversation notes"
          >
            ENDINGS ({unlockedCount}/{totalEndings})
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="border border-black bg-white px-2.5 py-1.5 font-mono text-[11px] tracking-wider uppercase text-black transition-colors hover:bg-black hover:text-white active:scale-95"
            aria-label="Restart playthrough"
          >
            RESTART
          </button>
        </div>
      </div>
    </header>
  );
};
