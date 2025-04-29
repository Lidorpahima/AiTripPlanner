import React from "react";
import { motion } from "framer-motion";
import ShareButton from "@/components/ShareButton";
import { Calendar, CalendarCheck, Clock, Wallet } from "lucide-react";
import { TripPlan, OriginalRequestData } from "@/constants/planTypes";

interface HeroSectionProps {
  plan: TripPlan;
  originalRequest: OriginalRequestData;
  formattedStartDate: string;
  formattedEndDate: string;
  duration: number;
  formatCurrency: (amount: number, currency?: string) => string;
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const HeroSection: React.FC<HeroSectionProps> = ({ plan, originalRequest, formattedStartDate, formattedEndDate, duration, formatCurrency }) => (
  <motion.div 
    variants={fadeIn}
    initial="hidden"
    animate="visible"
    className="flex flex-col items-center text-center mb-8"
  >
    <div className="flex items-center justify-center gap-2">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Your {plan.destination_info?.city || originalRequest.destination.split(',')[0]} Adventure
      </h1>
      {plan && <ShareButton plan={plan} />}
    </div>
    <p className="text-xl text-gray-600 max-w-3xl">{plan.summary}</p>
    {/* Trip Stats Cards */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full max-w-4xl">
      <motion.div 
        variants={fadeInUp}
        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center"
      >
        <Calendar className="h-8 w-8 text-blue-600 mb-2" />
        <h3 className="font-medium text-gray-500 text-sm">Start Date</h3>
        <p className="font-semibold">{formattedStartDate}</p>
      </motion.div>
      <motion.div 
        variants={fadeInUp}
        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center"
      >
        <CalendarCheck className="h-8 w-8 text-blue-600 mb-2" />
        <h3 className="font-medium text-gray-500 text-sm">End Date</h3>
        <p className="font-semibold">{formattedEndDate}</p>
      </motion.div>
      <motion.div 
        variants={fadeInUp}
        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center"
      >
        <Clock className="h-8 w-8 text-blue-600 mb-2" />
        <h3 className="font-medium text-gray-500 text-sm">Duration</h3>
        <p className="font-semibold">{duration} Days</p>
      </motion.div>
      <motion.div 
        variants={fadeInUp}
        className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center"
      >
        <Wallet className="h-8 w-8 text-blue-600 mb-2" />
        <h3 className="font-medium text-gray-500 text-sm">Budget Range</h3>
        <p className="font-semibold">
          {plan.total_cost_estimate ? 
            `${formatCurrency(plan.total_cost_estimate.min)} - ${formatCurrency(plan.total_cost_estimate.max)}` : 'Not available'}
        </p>
      </motion.div>
    </div>
  </motion.div>
);

export default HeroSection;
