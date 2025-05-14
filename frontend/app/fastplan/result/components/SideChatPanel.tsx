import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { X, Send, Check, AlertTriangle } from 'lucide-react'; // Added Check, AlertTriangle icons
import { Activity, TripPlan } from "@/constants/planTypes"; // Import Activity and TripPlan

// Define the structure for a chat message
export interface ChatMessage { // Exporting for use in parent component
  id: string; // Unique ID for each message
  text: string;
  sender: 'user' | 'ai' | 'system'; // System messages can be for initial context
  timestamp: Date;
  suggestedActivity?: Activity; // Add the suggested activity for AI messages
}

interface SideChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string, activityContext: Activity | null) => void;
  activityContext: Activity | null; // The activity being discussed
  isLoading: boolean;
  conversation: ChatMessage[]; // Pass the conversation history as a prop
  onAcceptSuggestion?: (activity: Activity) => void; // New prop for accepting a suggestion
  onRejectSuggestion?: (messageId: string) => void; // New prop for rejecting a suggestion
  // currentTripPlan: TripPlan | null; // We might not need the full trip plan here yet
}

const SideChatPanel = React.forwardRef<HTMLDivElement, SideChatPanelProps>(
  ({ isOpen, onClose, onSubmit, activityContext, isLoading, conversation, onAcceptSuggestion, onRejectSuggestion }, ref) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const handleSendMessage = () => {
      if (newMessage.trim() && activityContext) { // Ensure activityContext is present
        onSubmit(newMessage, activityContext);
        setNewMessage('');
      }
    };

    const handleClosePanel = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Close handler triggered');
      onClose();
    };

    useEffect(() => {
      if (isOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, [conversation, isOpen]);

    useEffect(() => {
        setNewMessage(''); // Clear input when activity context changes
        if (isOpen && activityContext) {
           // Focus the textarea when panel opens with a context
          const textarea = document.getElementById('chat-textarea');
          textarea?.focus();
        }
    }, [activityContext, isOpen]);

    // Add Escape key handler
    useEffect(() => {
      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          console.log('Escape key pressed, closing panel');
          onClose();
        }
      };
      
      window.addEventListener('keydown', handleEscapeKey);
      return () => window.removeEventListener('keydown', handleEscapeKey);
    }, [isOpen, onClose]);

    // Hide main site header when chat panel is open
    useEffect(() => {
      const siteHeader = document.querySelector('header.fixed.top-3.z-50.w-full, header.fixed.top-4.z-50.w-full, header.fixed.top-5.z-50.w-full') as HTMLElement;
      
      if (siteHeader && isOpen) {
        console.log('Hiding site header while chat panel is open');
        const originalDisplayStyle = siteHeader.style.display;
        siteHeader.style.display = 'none';
        
        return () => {
          if (siteHeader) {
            console.log('Restoring site header display');
            siteHeader.style.display = originalDisplayStyle;
          }
        };
      }
    }, [isOpen]);

    // Return null if panel is closed
    if (!isOpen) {
      return null;
    }

    const panelTitle = activityContext?.description
      ? `Suggest for: ${activityContext.description.substring(0, 40)}${activityContext.description.length > 40 ? '...' : ''}`
      : 'Suggest Alternative';

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
                Suggest for: {activityContext?.description?.substring(0, 60)}
                {activityContext?.description && activityContext.description.length > 60 ? '...' : ''}
              </p>
            </div>

            {/* Message Display Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50">
              {conversation.length === 0 && activityContext && (
                <div className="text-center text-sm text-gray-500 p-4 bg-gray-100 rounded-lg">
                  <p>What would you like to do instead of "{activityContext.description.substring(0, 40)}
                  {activityContext.description.length > 40 ? '...' : ''}"?</p>
                  <p className="mt-1">e.g., "Find a similar activity but cheaper" or "Suggest a good restaurant nearby"</p>
                </div>
              )}
              {conversation.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] lg:max-w-[80%] px-3.5 py-2.5 rounded-xl shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : msg.sender === 'ai'
                        ? 'bg-gray-100 text-gray-800 rounded-bl-none'
                        : 'bg-amber-100 text-amber-800 text-xs italic w-full text-center py-2' // System messages
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                    
                    {/* Add Accept/Reject buttons if this is an AI message with a suggestion */}
                    {msg.sender === 'ai' && msg.suggestedActivity && onAcceptSuggestion && onRejectSuggestion && (
                      <div className="flex justify-end mt-3 pt-2 border-t border-gray-200">
                        <button 
                          onClick={() => onAcceptSuggestion(msg.suggestedActivity!)}
                          className="text-xs flex items-center gap-1 text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 py-1 px-2 rounded mr-2 transition-all"
                          title="Accept this suggestion"
                        >
                          <Check size={14} /> Accept
                        </button>
                        <button 
                          onClick={() => onRejectSuggestion(msg.id)}
                          className="text-xs flex items-center gap-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 py-1 px-2 rounded transition-all"
                          title="Reject this suggestion"
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                  <p className={`text-xs mt-1.5 ${msg.sender === 'user' ? 'text-gray-500 mr-1' : 'text-gray-500 ml-1'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area */}
            {activityContext && (
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
            )}
            
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