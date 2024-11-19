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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPlaneDeparture, faGlobeAmericas } from '@fortawesome/free-solid-svg-icons';

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
    <div className="w-full p-6">
      <h2 className="text-3xl font-bold text-gray-700 mb-6">
        {planStatus === "upcoming" ? "Upcoming Meetups" : "Past Meetups"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan, index) => {
          const meetingTime = parse(plan.meetingTime, "MMMM d, yyyy 'at' h:mm:ss a", new Date());
          const now = new Date();
          const minutesDiff = differenceInMinutes(meetingTime, now);
          const isPlanUpcoming = minutesDiff > 0;

          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow relative border border-gray-200"
            >
              <div className="p-3">
                {/* Date and Transport */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500" />
                    {plan.meetingTime}
                  </div>
                </div>

                {/* Meeting Point */}
                <div className="mb-3">
                  <h4 className="text-lg font-semibold text-blue-600 flex items-center gap-1">
                    
                    <span>{plan.destination} 
                    <br/>
                      {plan.address}
                      </span>
                  </h4>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(plan.address || "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-bold hover:text-blue-700 underline text-sm"
                  >
                    View on Map
                  </a>
                </div>

                {/* People */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex flex-col text-gray-800">
                    <p className="font-medium text-md">
                      {plan.inviter.name}
                      <span className="text-xs font-semibold px-2 py-1 ml-2 bg-blue-100 text-blue-800 rounded">
                        Inviter
                      </span>
                    </p>
                    <p className="text-xs text-blue-400 flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4 " />
                      {plan.inviter.location}
                    </p>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                  <div className="flex flex-col text-gray-800 text-right">
                    <p className="font-medium text-md">
                      {plan.invitee.name}
                      <span className="text-xs font-semibold px-2 py-1 ml-2 bg-blue-100 text-blue-800 rounded">
                        Invitee
                      </span>
                    </p>
                    <p className="text-xs text-blue-500 flex items-center gap-1 justify-end">
                      <MapPinIcon className="w-4 h-4 " />
                      {plan.invitee.location}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                {planStatus === "upcoming" && (
                  <div className="flex justify-end gap-2 mt-4">
                    {!isPlanUpcoming && (
                      <button
                        onClick={() => handleCompleted(plan)}
                        className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-4 py-2 transition-colors"
                      >
                        Mark as Completed
                      </button>
                    )}
                    <button
                      onClick={() => handleCancel(plan)}
                      className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-4 py-2 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* No Plans Message */}
        {plans.length === 0 && (
        <div className="col-span-2 w-1/2 p-6 bg-white rounded-lg shadow text-center">
          <p className="text-accent-600  text-sm">
            {planStatus === "upcoming"
              ? "No upcoming meetups planned! Plan your next adventure and make unforgettable memories!"
              : "No past meetups found! Don't worry, there are plenty of exciting meetups waiting for you!"}
          </p>
        </div>
        )}
      </div>
    </div>
  );
};


