/**
 * ChatBubble Component
 * 
 * A floating chat input bubble that appears anchored to a button element.
 * Features include:
 * - Positioned relative to an anchor element
 * - Click outside to close
 * - Auto-focus on textarea
 * - Loading state handling
 * - Message validation
 * - Responsive design
 * - Clean animation transitions
 */

import React, { useState, useRef, useEffect } from "react";

/**
 * Props interface for ChatBubble component
 * @property isOpen - Whether the bubble is currently visible
 * @property anchorRef - Reference to the button element that anchors the bubble
 * @property onClose - Callback function to close the bubble
 * @property onSubmit - Callback function when a message is submitted
 * @property loading - Whether a message is currently being processed
 */
interface ChatBubbleProps {
  isOpen: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onSubmit: (message: string) => void;
  loading: boolean;
}

/**
 * ChatBubble Component
 * 
 * Renders a floating chat input bubble that appears anchored to a button element.
 * The bubble includes a textarea for message input and buttons for cancel/send actions.
 */
const ChatBubble: React.FC<ChatBubbleProps> = ({ isOpen, anchorRef, onClose, onSubmit, loading }) => {
  // State for message input
  const [message, setMessage] = useState("");
  // Ref for the bubble container to handle click outside
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Reset message when bubble is closed
  useEffect(() => {
    if (!isOpen) {
      setMessage("");
    }
  }, [isOpen]);

  // Handle click outside to close bubble
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        onClose(); // This will trigger the above useEffect to clear the message
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Don't render if bubble is closed or anchor is not available
  if (!isOpen || !anchorRef.current) return null;

  // Calculate bubble position based on anchor element
  const rect = anchorRef.current.getBoundingClientRect();
  const style: React.CSSProperties = {
    position: "absolute",
    top: rect.bottom + window.scrollY + 8,
    left: rect.left + window.scrollX,
    zIndex: 1000,
    minWidth: 260,
    maxWidth: 320,
  };

  return (
    <div ref={bubbleRef} style={style} className="bg-white border shadow-lg rounded-xl p-4">
      {/* Message input textarea */}
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={3}
        placeholder="What would you like to do instead?"
        value={message}
        onChange={e => setMessage(e.target.value)}
        disabled={loading}
        autoFocus
      />
      {/* Action buttons */}
      <div className="flex justify-end space-x-2">
        {/* Cancel button */}
        <button 
          onClick={() => {
            onClose(); // This will trigger the above useEffect to clear the message
          }} 
          className="text-gray-600 hover:text-black text-sm"
        >
          Cancel
        </button>
        {/* Send button */}
        <button
          onClick={() => { 
            if (message.trim()) {
              onSubmit(message); 
            }
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
          disabled={loading || !message.trim()}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatBubble;
