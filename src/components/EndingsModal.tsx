/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EndingId } from '../types/story';
import { ENDINGS } from '../data/storyGraph';
import { loadConversationNotes, saveConversationNotes } from '../utils/storage';

interface EndingsModalProps {
  unlockedEndings: EndingId[];
  onClose: () => void;
}

export const EndingsModal: React.FC<EndingsModalProps> = ({
  unlockedEndings,
  onClose,
}) => {
  const [notes, setNotes] = useState(loadConversationNotes());
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSaveNotes = () => {
    saveConversationNotes(notes);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const allEndingKeys: EndingId[] = [
    'thread_to_follow',
    'bridge_under_repair',
    'room_to_breathe',
    'ships_in_evening',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 sm:p-6"
    >
      <div className="relative my-auto w-full max-w-xl border-2 border-black bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-4 flex items-center justify-between border-b border-black/20 pb-3">
          <h2
            id="collection-title"
            className="font-mono text-sm font-semibold uppercase tracking-widest text-black"
          >
            ENDINGS & CONVERSATION NOTES
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-xs uppercase tracking-wider text-neutral-500 hover:text-black"
          >
            [CLOSE]
          </button>
        </div>

        {/* Endings List */}
        <section className="mb-6 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-neutral-600">
            <span>DISCOVERED RESOLUTIONS</span>
            <span>
              {unlockedEndings.length} OF {allEndingKeys.length}
            </span>
          </div>

          <div className="space-y-2">
            {allEndingKeys.map((key) => {
              const isUnlocked = unlockedEndings.includes(key);
              const ending = ENDINGS[key];
              return (
                <div
                  key={key}
                  className={`border p-3 transition-colors ${
                    isUnlocked
                      ? 'border-black bg-white'
                      : 'border-dashed border-neutral-300 bg-neutral-50 text-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider">
                      {isUnlocked ? '[DISCOVERED]' : '[LOCKED // UNEXPLORED]'}
                    </span>
                  </div>
                  <div className="font-serif text-base font-semibold text-black">
                    {isUnlocked ? ending.title : '???'}
                  </div>
                  <div className="font-mono text-[11px] text-neutral-600">
                    {isUnlocked ? ending.subtitle : 'Play to discover this social resolution.'}
                  </div>
                  {isUnlocked && (
                    <div className="mt-1 font-serif text-xs italic text-neutral-700">
                      "{ending.epitaph}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Personal Conversation Notes Pad */}
        <section className="mb-6 space-y-2 border-t border-black/20 pt-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-black">
              YOUR PERSONAL NOTES & REFLECTIONS
            </span>
            {savedStatus && (
              <span className="font-mono text-[11px] text-green-700">
                ✓ SAVED TO DEVICE
              </span>
            )}
          </div>
          <p className="font-serif text-xs text-neutral-600">
            Jot down thoughts on boundary dynamics, phrasing that worked, or things you want to try in real-life gatherings. Saved locally on your device.
          </p>

          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Offering specific help (like pulling the bread) was much easier for Maya than asking 'what can I do?'..."
            className="w-full border border-black p-3 font-serif text-base text-black placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-black"
            style={{ fontSize: '16px' }}
          />

          <button
            type="button"
            onClick={handleSaveNotes}
            className="border border-black bg-white px-4 py-2 font-mono text-xs uppercase tracking-wider text-black hover:bg-neutral-100"
          >
            SAVE NOTES
          </button>
        </section>

        <button
          type="button"
          onClick={onClose}
          className="w-full border border-black bg-black py-3 font-mono text-xs uppercase tracking-wider text-white hover:bg-neutral-800"
        >
          RETURN TO STORY
        </button>
      </div>
    </div>
  );
};
