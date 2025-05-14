import React, { useState, useRef, useEffect } from "react";

interface ChatBubbleProps {
  isOpen: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onSubmit: (message: string) => void;
  loading: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ isOpen, anchorRef, onClose, onSubmit, loading }) => {
  const [message, setMessage] = useState("");
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Effect to reset message when bubble is closed
  useEffect(() => {
    if (!isOpen) {
      setMessage("");
    }
  }, [isOpen]);

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

  if (!isOpen || !anchorRef.current) return null;
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
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={3}
        placeholder="What would you like to do instead?"
        value={message}
        onChange={e => setMessage(e.target.value)}
        disabled={loading}
        autoFocus
      />
      <div className="flex justify-end space-x-2">
        <button 
          onClick={() => {
            onClose(); // This will trigger the above useEffect to clear the message
          }} 
          className="text-gray-600 hover:text-black text-sm"
        >
          Cancel
        </button>
        <button
          onClick={() => { 
            if (message.trim()) {
              onSubmit(message); 
              // Optionally clear message on submit, or let onClose handle it when chatLoading becomes false and chatOpen becomes false
              // setMessage(""); // If we want to clear immediately after clicking send
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
