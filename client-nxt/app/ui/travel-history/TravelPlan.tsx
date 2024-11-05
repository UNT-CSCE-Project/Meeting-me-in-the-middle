"use client";
import {
    ArrowRightIcon,
    MapPinIcon,
    CalendarIcon,
    PlaneIcon,
    TrainIcon,
    BusIcon,
    CarIcon,
    ArrowUpRightIcon,
    MapIcon,
  } from "lucide-react";

import { TravelPlanInfo } from '@/app/lib/travel-history/definitions';
import { updateTravelHistory } from '@/app/lib/travel-history/actions';
import { useEffect, useState } from "react";
import {differenceInMinutes, parse } from 'date-fns';
export async function TravelPlan({ index, plan, planStatus }: { index: number; plan: TravelPlanInfo; planStatus: "upcoming" | "past" }) {
    const [isPlanUpcoming, setIsPlanUpcoming] = useState(false);
    const handleClick = async(plan: TravelPlanInfo) => {
        const response = await updateTravelHistory(plan.id, "Traveled");
        if (response.status === 200) {
          window.location.reload();
        } else {
          console.log(response);
    
        }
      }
      useEffect(() => {
        if(planStatus === "upcoming") {
            const meetingTime = parse(plan.meetingTime, "MMMM d, yyyy 'at' h:mm:ss a", new Date());
            const now = new Date();
          
            const minutesDiff = differenceInMinutes(meetingTime, now);
            const isUpcoming = minutesDiff > 0;  
            setIsPlanUpcoming(isUpcoming);
        }
      }, [planStatus, plan.meetingTime])
    return (
        <div
        key={index}
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
      >
        <div className="p-3">
          {/* Date and Transport */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <CalendarIcon className="w-3.5 h-3.5" />
              {plan.meetingTime}
            </div>
          </div>

          {/* Meeting Point */}
          <div className="mb-2">
            <h4 className="text-base font-semibold text-blue-600">
              <div>
                {plan.destination}{" "}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    plan.address || ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-red-600 hover:text-blue-800"
                  aria-label={`Navigate to ${plan.destination}`}
                >
                  <MapPinIcon className="w-5 h-5 inline" />{" "}
                  {/* Adjust size as needed */}
                </a>
              </div>
              {plan.address}
            </h4>
          </div>

          {/* People */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-md text-gray-900 truncate">
                {plan.inviter.name}
                <span className="text-md font-semibold px-3 py-1 rounded-full bg-blue-100 ">
                  Inviter
                </span>
              </p>
              <p className="text-xs text-blue-600 flex items-center gap-1 truncate ">
                <MapPinIcon className="w-3 h-3 flex-shrink-0 " />
                {plan.inviter.location}
              </p>
            </div>
            <ArrowRightIcon className="w-5 h-3 text-green-600  flex-shrink-0" />
            <div className="flex-1 min-w-0 text-right">
              <p className="font-medium text-md text-gray-900 truncate">
                {plan.invitee.name}
                <span className="text-md font-semibold px-3 py-1 rounded-full bg-blue-100 ">
                  Invitee
                </span>
              </p>
              <p className="text-xs text-gray-600 flex items-center justify-end gap-1 truncate">
                <MapPinIcon className="w-3 h-3 flex-shrink-0" />
                {plan.invitee.location}
              </p>
            </div>
          </div>

          {/* Button */}
          {planStatus === "upcoming" && plan.is_traveled === false && isPlanUpcoming && (
            <div className="text-right">
              <button className="px-3 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-amber-600 transition-colors"
               onClick={() => handleClick(plan)}
               >
                Mark as Met
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }