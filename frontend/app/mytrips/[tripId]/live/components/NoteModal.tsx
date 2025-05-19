import React, { useState, useEffect } from 'react';

interface NoteModalProps {
  isOpen: boolean;
  initialNote: string;
  onSave: (note: string) => void;
  onClose: () => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, initialNote, onSave, onClose }) => {
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
        <h2 className="text-lg font-bold mb-2">Personal Note</h2>
        <textarea
          className="w-full border rounded-md p-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Write your note here..."
        />
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