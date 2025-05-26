/**
 * SideChatPanel Component
 * 
 * A side panel component that provides an interactive chat interface for trip planning.
 * Features include:
 * - Real-time chat with AI assistant
 * - Activity suggestions and modifications
 * - Message history display
 * - Responsive design (mobile and desktop)
 * - Keyboard shortcuts (Escape to close)
 * - Loading states and animations
 * - Auto-scrolling to latest messages
 * - Support for both activity replacement and addition modes
 */

import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { X, Send, Check, AlertTriangle, Star, MapPin, Globe } from 'lucide-react'; // Removed unused icons after ChatMessageItem extraction
import { Activity, TripPlan } from "@/constants/planTypes";
import ChatMessageItem from './ChatMessageItem'; // Import the new component

/**
 * Chat message data structure
 * @property id - Unique identifier for the message
 * @property text - The message content
 * @property sender - Who sent the message ('user', 'ai', or 'system')
 * @property timestamp - When the message was sent
 * @property suggestedActivities - Optional array of activities suggested by the AI
 */
export interface ChatMessage { // Still exported as ChatMessageItem.tsx imports it
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  suggestedActivities?: Activity[];
}

/**
 * Props interface for SideChatPanel component
 * @property isOpen - Whether the panel is currently visible
 * @property onClose - Callback function to close the panel
 * @property onSubmit - Callback function when a new message is sent
 * @property activityContext - The current activity being discussed (if any)
 * @property isLoading - Whether a message is currently being processed
 * @property conversation - Array of chat messages to display
 * @property onAcceptSuggestion - Callback when a suggested activity is accepted
 * @property onRejectIndividualActivity - Callback when a specific activity is rejected
 * @property onRejectSuggestion - Callback when all suggestions in a message are rejected
 * @property destinationInfo - Information about the trip destination
 * @property panelMode - Whether the panel is in 'replace' or 'add' mode
 * @property addModeTitle - Custom title for 'add' mode
 */
interface SideChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string, activityContext: Activity | null) => void;
  activityContext: Activity | null;
  isLoading: boolean;
  conversation: ChatMessage[];
  onAcceptSuggestion?: (activity: Activity) => void;
  onRejectIndividualActivity?: (activityToReject: Activity, messageId: string) => void;
  onRejectSuggestion?: (messageId: string) => void;
  destinationInfo?: TripPlan['destination_info'];
  panelMode?: 'replace' | 'add'; // New prop, defaults to 'replace'
  addModeTitle?: string; // Optional title for 'add' mode
}

/**
 * SideChatPanel Component
 * 
 * Renders a side panel with chat functionality for trip planning assistance.
 * Supports both activity replacement and addition modes.
 */
const SideChatPanel = React.forwardRef<HTMLDivElement, SideChatPanelProps>(
  (props: SideChatPanelProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    // Destructure props with default values
    const {
      isOpen,
      onClose,
      onSubmit,
      activityContext,
      isLoading,
      conversation,
      onAcceptSuggestion,
      onRejectIndividualActivity,
      onRejectSuggestion,
      destinationInfo,
      panelMode = 'replace',
      addModeTitle = 'Suggest New Activity' 
    } = props;

    // State for new message input
    const [newMessage, setNewMessage] = useState('');
    // Ref for auto-scrolling to latest message
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    /**
     * Handles sending a new message
     * Clears the input after sending
     */
    const handleSendMessage = () => {
      if (newMessage.trim()) {
        onSubmit(newMessage, activityContext);
        setNewMessage('');
      }
    };

    /**
     * Handles closing the panel
     * Prevents event propagation to avoid unwanted side effects
     */
    const handleClosePanel = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    };

    // Auto-scroll to latest message when conversation updates
    useEffect(() => {
      if (isOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, [conversation, isOpen]);

    // Reset message input and focus textarea when panel opens
    useEffect(() => {
        setNewMessage('');
        if (isOpen) {
          const textarea = document.getElementById('chat-textarea');
          textarea?.focus();
        }
    }, [isOpen]);

    // Handle Escape key to close panel
    useEffect(() => {
      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose();
        }
      };
      window.addEventListener('keydown', handleEscapeKey);
      return () => window.removeEventListener('keydown', handleEscapeKey);
    }, [isOpen, onClose]);

    // Hide site header when panel is open (mobile optimization)
    useEffect(() => {
      const siteHeader = document.querySelector('header.fixed.top-3.z-50.w-full, header.fixed.top-4.z-50.w-full, header.fixed.top-5.z-50.w-full') as HTMLElement;
      if (siteHeader && isOpen) {
        const originalDisplayStyle = siteHeader.style.display;
        siteHeader.style.display = 'none';
        return () => {
          if (siteHeader) {
            siteHeader.style.display = originalDisplayStyle;
          }
        };
      }
    }, [isOpen]);

    // Don't render anything if panel is closed
    if (!isOpen) {
      return null;
    }

    // Determine panel title based on mode and context
    const effectivePanelTitle = panelMode === 'add' 
      ? addModeTitle 
      : activityContext?.description
        ? `Suggest for: ${activityContext.description.substring(0, 40)}${activityContext.description.length > 40 ? '...' : ''}`
        : 'Suggest Alternative'; // Fallback for replace mode if description is missing

    return (
      <>
        {/* Mobile overlay/backdrop */}
        <div 
          className="fixed inset-0 bg-black/30 z-[99998] md:hidden" 
          onClick={() => onClose()}
        ></div>
        
        {/* Main panel container */}
        <div
          ref={ref}
          className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-2xl z-[99999] flex flex-col"
          aria-modal="true"
          role="dialog"
        >
          {/* Floating close button */}
          <button
            onClick={() => onClose()}
            className="absolute top-3 right-3 w-8 h-8 z-[999999] bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg"
          >
            <X size={18} />
          </button>

          {/* Content container */}
          <div className="flex flex-col h-full">
            {/* Title and info - repositioned to accommodate X button */}
            <div className="p-4 pr-12 border-b border-gray-200 bg-gray-50">
              <p className="text-sm font-semibold text-gray-700 line-clamp-2">
                {effectivePanelTitle}
              </p>
            </div>

            {/* Message Display Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50">
              {/* Empty state message for replace mode */}
              {panelMode === 'replace' && conversation.length === 0 && activityContext && (
                <div className="text-center text-sm text-gray-500 p-4 bg-gray-100 rounded-lg">
                  <p>What would you like to do instead of "{activityContext.description.substring(0, 40)}
                  {activityContext.description.length > 40 ? '...' : ''}"?</p>
                  <p className="mt-1">e.g., "Find a similar activity but cheaper" or "Suggest a good restaurant nearby"</p>
                </div>
              )}
              {/* Render chat messages */}
              {conversation.map((msg) => (
                <ChatMessageItem
                  key={msg.id}
                  msg={msg}
                  destinationInfo={destinationInfo}
                  onAcceptSuggestion={onAcceptSuggestion}
                  onRejectIndividualActivity={onRejectIndividualActivity}
                  onRejectSuggestion={onRejectSuggestion}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area - Show if panel is open */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <textarea
                  id="chat-textarea"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your request..."
                  className="flex-grow p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !newMessage.trim()}
                  className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center aspect-square"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </div>
            
            {/* Additional close button at the bottom */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
              <button
                onClick={() => onClose()}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
);

SideChatPanel.displayName = 'SideChatPanel';
export default SideChatPanel; 