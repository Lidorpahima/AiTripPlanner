import React from 'react';
import { X, Check, Star, MapPin, Globe } from 'lucide-react';
import { Activity, TripPlan } from "@/constants/planTypes";
import { ChatMessage } from './SideChatPanel'; // Assuming ChatMessage is exported from SideChatPanel

interface ChatMessageItemProps {
  msg: ChatMessage;
  destinationInfo?: TripPlan['destination_info'];
  onAcceptSuggestion?: (activity: Activity) => void;
  onRejectIndividualActivity?: (activityToReject: Activity, messageId: string) => void;
  onRejectSuggestion?: (messageId: string) => void; // For fallback legacy single suggestion
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  msg,
  destinationInfo,
  onAcceptSuggestion,
  onRejectIndividualActivity,
  onRejectSuggestion,
}) => {
  return (
    <div
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
            : 'bg-amber-100 text-amber-800 text-xs italic w-full text-center py-2'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>

        {msg.sender === 'ai' && msg.suggestedActivities && Array.isArray(msg.suggestedActivities) && msg.suggestedActivities.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600 space-y-3">
            {msg.suggestedActivities.map((suggestedActivityItem, index) => (
              <div key={index} className="p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-750">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {msg.suggestedActivities && msg.suggestedActivities.length > 1 ? `Option ${index + 1}: ` : "Suggested: "}
                  { (suggestedActivityItem as any).name || suggestedActivityItem.description }
                </p>

                {typeof (suggestedActivityItem as any).rating === 'number' && (suggestedActivityItem as any).rating > 0 && (
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                    <span className="font-medium mr-1.5">Rating:</span>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < Math.round((suggestedActivityItem as any).rating!) ? "text-yellow-400 fill-yellow-400" : "text-gray-400 dark:text-gray-500"} />
                    ))}
                    <span className="ml-1.5 font-medium">({(suggestedActivityItem as any).rating.toFixed(1)})</span>
                    {typeof (suggestedActivityItem as any).user_ratings_total === 'number' && (
                      <span className="ml-1 text-gray-500 dark:text-gray-400"> - {(suggestedActivityItem as any).user_ratings_total.toLocaleString()} reviews</span>
                    )}
                  </div>
                )}
                {((suggestedActivityItem as any).google_maps_url || (suggestedActivityItem as any).location_query || (suggestedActivityItem as any).place_details?.name || suggestedActivityItem.description) && (() => {
                  const activity = suggestedActivityItem as any;
                  let mapUrl = activity.google_maps_url;
                  if (!mapUrl) {
                    let queryBase = activity.location_query || activity.place_details?.name || suggestedActivityItem.description;
                    if (activity.location_query) {
                      mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryBase)}`;
                    } else {
                      const fullQuery = [queryBase, destinationInfo?.city, destinationInfo?.country].filter(Boolean).join(', ');
                      mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullQuery)}`;
                    }
                  }
                  return (
                    <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center mb-1">
                      <MapPin size={13} className="mr-1.5 flex-shrink-0" /> View on Map
                    </a>
                  );
                })()}
                {(suggestedActivityItem as any).website && (
                    <a href={(suggestedActivityItem as any).website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center">
                      <Globe size={13} className="mr-1.5 flex-shrink-0" /> Visit Website
                    </a>
                )}

                {onAcceptSuggestion && onRejectIndividualActivity && (
                  <div className="flex justify-end mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => onAcceptSuggestion(suggestedActivityItem)}
                      className="text-xs flex items-center gap-1 text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 py-1 px-2 rounded mr-2 transition-all"
                      title="Accept this option"
                    >
                      <Check size={14} /> Accept
                    </button>
                    <button
                      onClick={() => onRejectIndividualActivity(suggestedActivityItem, msg.id)}
                      className="text-xs flex items-center gap-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 py-1 px-2 rounded transition-all"
                      title="Reject this option"
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {msg.sender === 'ai' && !(msg.suggestedActivities && Array.isArray(msg.suggestedActivities)) && (msg.suggestedActivities as unknown as Activity) && onRejectSuggestion && (
           <div className="flex justify-end mt-3 pt-2 border-t border-gray-300 dark:border-gray-700">
             <button
               onClick={() => onRejectSuggestion(msg.id)}
               className="text-xs flex items-center gap-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 py-1 px-2 rounded transition-all"
               title="Reject this suggestion"
             >
               <X size={14} /> Reject Suggestion
             </button>
           </div>
        )}
      </div>
      <p className={`text-xs mt-1.5 ${msg.sender === 'user' ? 'text-gray-500 mr-1' : 'text-gray-500 ml-1'}`}>
        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
};

export default ChatMessageItem; 