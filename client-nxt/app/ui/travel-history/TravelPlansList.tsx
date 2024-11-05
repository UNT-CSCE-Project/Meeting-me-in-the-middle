import React from "react";
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
import { TravelPlanInfo } from "@/app/lib/travel-history/definitions";
import {differenceInMinutes, parse } from 'date-fns';

import { createTravelPlan, deleteTravelHistory, updateTravelHistory } from "@/app/lib/travel-history/actions";
export const TravelPlansList = ({
  plans,
  planStatus,
}: {
  plans: TravelPlanInfo[];
  planStatus: "upcoming" | "past";
}) => {
  
  const handleCompleted = async(plan: TravelPlanInfo) => {
    const response = await updateTravelHistory(plan.id, "Traveled");
    if (response.status === 200) {
      window.location.reload();
    } else {
      console.log(response);

    }
  }
  const handleCancel = async(plan: TravelPlanInfo) => {
    const response = await deleteTravelHistory(plan.id);
    if (response.status === 200) {
      window.location.reload();
    } else {
      console.log(response);
    }
  }
  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold mb-4">
        {planStatus === "upcoming" ? "Upcoming Meetups" : "Past Meetups"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan, index) => {
          // Add the meeting time comparison logic here
          const meetingTime = parse(plan.meetingTime, "MMMM d, yyyy 'at' h:mm:ss a", new Date());
          const now = new Date();
          const minutesDiff = differenceInMinutes(meetingTime, now);
          const isPlanUpcoming = minutesDiff > 0;
          console.log(isPlanUpcoming);

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
                      
                       <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          plan.address || ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-red-600 hover:text-blue-800"
                        aria-label={`Navigate to ${plan.destination}`}
                      >
                        <MapIcon className="w-5 h-5 inline" />
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
                {planStatus === "upcoming" && (
                  <div className="text-right gap-2"> {
                    !isPlanUpcoming && (
                      <button
                        onClick={() => handleCompleted(plan)}
                        className="text-white gap-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        Completed
                      </button>
                    ) 
                  }
                    <button
                        onClick={() => handleCancel(plan)}
                        className="ml-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        Cancel
                      </button>
                  
                    

                  </div>
                )}
              </div>
            </div>
          );
        })}
        {plans.length === 0 && (
          <div className="col-span-2 p-6 bg-white rounded-lg shadow text-center">
            <p className="text-gray-500 italic text-sm">
              {planStatus === "upcoming"
                ? "No upcoming meetups planned"
                : "No past meetups found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


