"use client";
import { useUser } from "@/app/UserContext";
import {UserAvatar} from "./userAvatar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProfileInfo({firstName, lastName}:{firstName: string, lastName: string}) {

    
    return (
        <>
            {firstName && lastName && (
                <>
                    <div className="object-cover sb-avatar sb-avatar--text" style={{ display: 'inline-block', verticalAlign: 'middle', width: '50px', height: '50px', borderRadius: '100%', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                      <div className="object-cover sb-avatar__text" title="Avijeet Shil" style={{ width: '50px', height: '50px', lineHeight: 'initial', textAlign: 'center', color: 'rgb(255, 255, 255)', borderRadius: '100%', background: 'rgb(126, 55, 148)' }}>
                        <div style={{ display: 'table', tableLayout: 'fixed', width: '100%', height: '100%', fontSize: '16.6667px' }}>
                          <span style={{ display: 'table-cell', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                            <span>AS</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 mr-4 text-white">{firstName + " " + lastName}</p>
                </>
            ) }
        </>
    ) 
}