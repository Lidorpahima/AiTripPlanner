import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { Share2, Copy, MessageCircle, Mail } from "lucide-react";
import { TripPlan } from "@/constants/planTypes";

function formatPlanText(plan: TripPlan): string {
  let text = `🗓️ Trip Plan\n`;
  text += plan.summary + "\n\n";
  plan.days.forEach((day, i) => {
    text += `Day ${i + 1}: ${day.title}\n`;
    day.activities.forEach((act: any) => {
      text += `  - ${act.time ? act.time + ' | ' : ''}${act.description}\n`;
    });
    text += "\n";
  });
  return text.trim();
}

const ShareButton: React.FC<{ plan: TripPlan }> = ({ plan }) => {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'left'|'right'>('right');
  const shareText = formatPlanText(plan);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    const updateMenuPosition = () => {
      if (!buttonRef.current) return;
      
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      
      if (buttonRect.right > screenWidth - 200) {
        setMenuPosition('left');
      } else {
        setMenuPosition('right');
      }
    };

    updateMenuPosition();
    window.addEventListener('resize', updateMenuPosition);
    
    return () => {
      window.removeEventListener('resize', updateMenuPosition);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    
    if (open) {
      document.addEventListener("mousedown", handleClickOutside as EventListener);
      // Add touch support for mobile devices
      document.addEventListener("touchstart", handleClickOutside as EventListener);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as EventListener);
      document.removeEventListener("touchstart", handleClickOutside as EventListener);
    };
  }, [open]);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText)
        .then(() => toast.success("Itinerary copied!"))
        .catch(() => toast.error("Failed to copy itinerary"));
    } else {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = shareText;
      // Make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          toast.success("Itinerary copied!");
        } else {
          toast.error("Failed to copy itinerary");
        }
      } catch (err) {
        toast.error("Failed to copy itinerary");
      }
      
      document.body.removeChild(textArea);
    }
    setOpen(false);
  };
  
  const handleWhatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`);
    setOpen(false);
  };
  
  const handleEmail = () => {
    window.open(`mailto:?subject=My Trip Itinerary&body=${encodeURIComponent(shareText)}`);
    setOpen(false);
  };
  
  return (
    <div className="relative inline-block text-left ml-2">
      <button
        ref={buttonRef}
        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 border border-blue-300 shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-400 mt-5"
        onClick={() => setOpen((v) => !v)}
        title="Share"
        aria-label="Share itinerary"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Share2 size={22} className="text-blue-600" />
      </button>
      
      {open && (
        <div
          ref={menuRef}
          style={{ maxWidth: 'calc(100vw - 24px)' }}
          className={`
            absolute z-50 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl 
            ${menuPosition === 'left' ? 'right-0' : 'left-0'} 
            animate-fade-in
          `}
        >
          <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-700 text-sm flex items-center gap-2">
            <Share2 size={16} className="text-blue-500 flex-shrink-0" /> 
            <span className="truncate">Share this itinerary</span>
          </div>
          
          <button
            onClick={handleCopy}
            className="flex items-center w-full px-4 py-3 hover:bg-gray-50 text-sm transition group"
          >
            <Copy size={18} className="mr-3 text-gray-500 group-hover:text-blue-600 flex-shrink-0" />
            <span>Copy Itinerary</span>
          </button>
          
          <div className="border-t border-gray-100 mx-3" />
          
          <button
            onClick={handleWhatsapp}
            className="flex items-center w-full px-4 py-3 hover:bg-green-50 text-sm transition group"
          >
            <MessageCircle size={18} className="mr-3 text-green-500 group-hover:text-green-700 flex-shrink-0" />
            <span className="text-green-700 group-hover:underline">Share on WhatsApp</span>
          </button>
          
          <div className="border-t border-gray-100 mx-3" />
          
          <button
            onClick={handleEmail}
            className="flex items-center w-full px-4 py-3 hover:bg-blue-50 text-sm transition group"
          >
            <Mail size={18} className="mr-3 text-blue-500 group-hover:text-blue-700 flex-shrink-0" />
            <span className="text-blue-700 group-hover:underline">Send by Email</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
