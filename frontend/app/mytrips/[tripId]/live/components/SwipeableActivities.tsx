import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, CheckCircle, StickyNote, MapPin, ArrowLeftRight } from 'lucide-react';
import { LiveActivity } from '../liveTypes';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence, Position } from 'framer-motion';

interface SwipeableActivitiesProps {
  activities: LiveActivity[];
  currentDayIndex: number;
  highlightedActivityId?: string | null;
  onAdd: (afterActivityId: string | null) => void;
  onComplete: (activityId: string) => void;
  onMap: (activityId: string) => void;
  onNote: (activityId: string) => void;
}

const variants = {
  enter: (direction: number) => ({
    x: direction === 1 ? 300 : -300,
    opacity: 0,
    position: direction === 1 ? ('absolute' as Position) : ('absolute' as Position),
  }),
  center: {
    x: 0,
    opacity: 1,
    position: 'relative' as Position,
  },
  exit: (direction: number) => ({
    x: direction === 1 ? -300 : 300,
    opacity: 0,
    position: direction === 1 ? ('absolute' as Position) : ('absolute' as Position),
  }),
};

const SwipeableActivities: React.FC<SwipeableActivitiesProps> = ({
  activities,
  currentDayIndex,
  highlightedActivityId,
  onAdd,
  onComplete,
  onMap,
  onNote,
}) => {
  const initialIndex = highlightedActivityId
    ? Math.max(0, activities.findIndex(a => a.id === highlightedActivityId))
    : 0;
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0); // 1 = next, -1 = prev

  const activity = activities[index];

  const next = () => {
    if (index < activities.length - 1) {
      setDirection(1);
      setIndex(i => i + 1);
    }
  };
  const prev = () => {
    if (index > 0) {
      setDirection(-1);
      setIndex(i => i - 1);
    }
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => prev(),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  if (!activity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <p className="text-gray-500">No activities for this day.</p>
        <button
          onClick={() => onAdd(null)}
          className="mt-6 bg-blue-600 text-white rounded-full shadow-lg flex items-center px-6 py-3 text-lg font-bold hover:bg-blue-700"
        >
          <Plus className="mr-2" size={24} /> Add Activity
        </button>
      </div>
    );
  }

  // Progress bar
  const progress = ((index + 1) / activities.length) * 100;

  return (
    <div className="relative max-w-md mx-auto w-full flex flex-col items-center">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full mb-2 overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Activity Card with animation */}
      <div className="relative w-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activity.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            {...swipeHandlers}
            className="p-6 bg-white rounded-2xl shadow-2xl flex flex-col items-center w-full animate-fade-in select-none border border-blue-100"
            style={{ touchAction: 'pan-y', minHeight: 260 }}
          >
            <h2 className="text-xl font-bold mb-2 text-center text-gray-900">{activity.description}</h2>
            {activity.time && (
              <p className="text-blue-700 font-semibold mb-1 text-lg">{activity.time}</p>
            )}
            {activity.place_name_for_lookup && (
              <p className="text-gray-500 mb-3 text-sm">{activity.place_name_for_lookup}</p>
            )}
            {/* Action Buttons */}
            <div className="flex space-x-3 mt-2">
              <button
                onClick={() => onComplete(activity.id)}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 focus:outline-none shadow"
              >
                <CheckCircle className="mr-1" size={18} /> Done
              </button>
              <button
                onClick={() => onNote(activity.id)}
                className="flex items-center bg-yellow-400 text-white px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 focus:outline-none shadow"
              >
                <StickyNote className="mr-1" size={18} /> Note
              </button>
              <button
                onClick={() => onMap(activity.id)}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-600 focus:outline-none shadow"
              >
                <MapPin className="mr-1" size={18} /> Map
              </button>
            </div>
            {/* Swipe hint for mobile */}
            <div className="mt-6 flex flex-col items-center md:hidden select-none">
              <motion.div
                animate={{ x: [0, 30,-20,10,-5, 0] }}
                transition={{  duration: 1 }}
                className="flex items-center text-blue-400"
              >
                <ArrowLeftRight size={22} className="mx-1" />
                <span className="text-xs ml-1">Swipe left/right</span>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Add Activity FAB */}
      <button
        onClick={() => onAdd(activity.id)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full shadow-lg flex items-center px-6 py-3 text-lg font-bold hover:bg-blue-700 z-50"
      >
        <Plus className="mr-2" size={28} /> Add Activity
      </button>
      {/* Progress indicator */}
      <div className="mt-4 text-sm text-gray-500">{index + 1} / {activities.length}</div>
    </div>
  );
};

export default SwipeableActivities; 