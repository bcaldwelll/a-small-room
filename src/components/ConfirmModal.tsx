/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  confirmLabel,
  cancelLabel = 'CANCEL',
  onConfirm,
  onCancel,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 sm:p-6"
    >
      <div className="relative my-auto w-full max-w-md border-2 border-black bg-white p-6 shadow-2xl sm:p-8">
        <h2
          id="confirm-modal-title"
          className="font-mono text-xs font-semibold uppercase tracking-widest text-black"
        >
          {title}
        </h2>

        <p className="mt-3 font-serif text-base text-neutral-800">
          {message}
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-black bg-white py-2.5 font-mono text-xs uppercase tracking-wider text-black hover:bg-neutral-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 border border-black bg-black py-2.5 font-mono text-xs uppercase tracking-wider text-white hover:bg-neutral-800"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
