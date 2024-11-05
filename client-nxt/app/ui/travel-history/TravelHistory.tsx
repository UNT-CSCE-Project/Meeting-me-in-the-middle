"use client";
import React, { useEffect } from 'react';
import { ArrowRightIcon, MapPinIcon, CalendarIcon, PlaneIcon, TrainIcon, BusIcon, CarIcon, ArrowUpRightIcon, MapIcon } from 'lucide-react';



import { useState } from 'react';
import { useUser } from '@/app/UserContext';
import { fetchLocationApprovalByStatus } from '@/app/lib/locationApproval/data';
import { TravelPlanInfo } from '@/app/lib/travel-history/definitions';
import { TravelPlansList } from './TravelPlansList';
import fetchTravelHistoryByUserIdAndIsTraveled from '@/app/lib/travel-history/data';
export const TravelHistory = ( ) => {

    const {userData} = useUser();
    const [upcomingPlans, setUpcomingPlans] = useState<TravelPlanInfo[]>([]);
    const [pastPlans, setPastPlans] = useState<TravelPlanInfo[]>([]);
    useEffect(() => {
       
        const fetchUpcomingPlansData = async () => {
            if (userData && userData.uid) {
                const data = await (await fetchTravelHistoryByUserIdAndIsTraveled(userData.uid, false))
                const travelPlans = await Promise.all(
                  data.map(async (item) => ({
                    id: item.id,
                    invitee: item.invitee,
                    inviter: item.inviter,
                    place: item.place,
                    destination: item.place.name,
                    address: await item.address,
                    meetingTime: item.meetingTime,
                    status: item.status,
                    is_deleted: item.is_deleted,
                    is_traveled: false,
                    updated_at: item.updated_at,
                  }))
                );
                
                setUpcomingPlans(travelPlans as TravelPlanInfo[]);
                console.log(travelPlans);

            }
        };

        const fetchPastData = async () => {
            if (userData && userData.uid) {
                const data = await (await fetchTravelHistoryByUserIdAndIsTraveled(userData.uid, true))
                const pastTravelPlans = await Promise.all(
                  data.map(async (item ) => ({
                    invitee: item.invitee,
                    inviter: item.inviter,
                    meetingTime: item.meetingTime,
                    destination: item.place.name,
                    address: await item.address,
                    is_traveled: false,
                    id: item.id,
                  }))
                );
                
                setPastPlans(pastTravelPlans as TravelPlanInfo[]);
                console.log(pastTravelPlans);
            }
        }
        fetchUpcomingPlansData();
        fetchPastData();
    
    }, [userData]);

  return (
    <div className=  "flex flex-col space-y-4"> {/* Adjust gap-4 for spacing between rows */}
        <TravelPlansList plans={upcomingPlans} planStatus='upcoming'/>
        <TravelPlansList plans={pastPlans} planStatus='past'/>
    </div>
    
  );
};

export default TravelHistory;