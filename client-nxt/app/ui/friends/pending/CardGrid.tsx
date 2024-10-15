import React from "react";
import { Card } from "./Card";
import Link from "next/link";
export function CardGrid({ requests }: CardGridProps) {
  console.log(requests)
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 px-3">

        {requests?.map((request) => (
          <Card key={request.id} request={request} />
        ))} 

  
        {/* Render "See All" only if there are more than 5 cards */}
        {/* {requests.length > 5 && (
          <Link
            href="/see-all"
            className="mt-4 flex items-center rounded-smp-4 text-black-500 hover:text-blue-700" 
          >
            See All
          </Link>
        )} */}
      </div>
      
    );
  }