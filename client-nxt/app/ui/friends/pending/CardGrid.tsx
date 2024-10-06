import React from "react";
import { Card } from "./Card";
import Link from "next/link";
export function CardGrid({ cards }) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 px-3">
        {cards.slice(0, 5).map((card, index) => (
          <React.Fragment key={index}>
            <Card title={card.title} value={card.value} type={card.type} />
          </React.Fragment>
        ))}
  
        {/* Render "See All" only if there are more than 5 cards */}
        {cards.length > 5 && (
          <Link
            href="/see-all"
            className="mt-4 flex items-center rounded-smp-4 text-black-500 hover:text-blue-700" 
          >
            See All
          </Link>
        )}
      </div>
      
    );
  }