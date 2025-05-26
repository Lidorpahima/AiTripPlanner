/**
 * NoteModal Component
 * 
 * A modal dialog component for adding and editing activity notes.
 * Features include:
 * - Text input for note content
 * - Save and cancel actions
 * - Initial note state management
 * - Responsive design
 * - Animated transitions
 */

import React, { useState, useEffect } from 'react';

/**
 * Props interface for NoteModal component
 * @property isOpen - Controls modal visibility
 * @property initialNote - Initial note content
 * @property onSave - Callback function when note is saved
 * @property onClose - Callback function when modal is closed
 */
interface NoteModalProps {
  isOpen: boolean;
  initialNote: string;
  onSave: (note: string) => void;
  onClose: () => void;
}

/**
 * NoteModal Component
 * 
 * Renders a modal dialog for editing activity notes with a textarea
 * and action buttons. Manages note state and provides save/cancel
 * functionality.
 */
const NoteModal: React.FC<NoteModalProps> = ({ isOpen, initialNote, onSave, onClose }) => {
  // State for note content
  const [note, setNote] = useState(initialNote);

  // Update note content when initialNote or modal state changes
  useEffect(() => {
    setNote(initialNote);
  }, [initialNote, isOpen]);

  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/80 bg-opacity-40">
      {/* Modal container */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
        {/* Modal header */}
        <h2 className="text-lg font-bold mb-2">Personal Note</h2>
        
        {/* Note textarea */}
        <textarea
          className="w-full border rounded-md p-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Write your note here..."
        />
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            onClick={() => { onSave(note); onClose(); }}
            disabled={note === initialNote}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal; 