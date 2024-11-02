"use client";
import { useUser } from "@/app/UserContext";
import { useEffect, useState } from "react";
import { fetchLocationApprovals } from "@/app/lib/locationApproval/data";
import { approvalInfo } from "@/app/lib/locationApproval/definitions";
import { UserAvatar } from "../userAvatar";
import ApprovalStatus from "../locationapproval/status";
import {AcceptInvitation} from "./buttons";
import {DeclineInvitation} from "./buttons";
export default function ApprovalList() {
  const [approvals, setApprovals] = useState<approvalInfo[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const { userData } = useUser();
  useEffect(() => {
    setIsFetching(true);

    async function fetchData() {
      if (!userData) {
        return;
      }
      const data = await fetchLocationApprovals(userData?.uid);
      console.log(data);
      setApprovals(data);
      console.log(data);
      setIsFetching(false);
    }
    fetchData();
  }, [userData, setIsFetching, setApprovals, fetchLocationApprovals]);
  const changeAfterAccept = (item: approvalInfo) => {
    const updatedApprovals = approvals.map((approval) => {
      if (approval.id === item.id) {
        return { ...approval, status: "accepted" };
      }
      return approval;
    });
    setApprovals(updatedApprovals);
    setIsFetching(false);
  };
  const filterAfterDecline = (item: approvalInfo) => {
    const updatedApprovals = approvals.filter(
      (approval) => approval.id !== item.id
    );
    setApprovals(updatedApprovals);
    setIsFetching(false);
  };
  return (
    <div className="mt-6 flow-root flex flex-col lg:flex-row h-screen w-full p-6 bg-gray-100">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-blue-50 p-2 md:pt-0 ml-4 mr-4">
          {approvals.length === 0 && !isFetching ? (
            <div className="w-full text-center">No invitation found</div>
          ) : (
            !isFetching &&
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal text-center">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Place
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {approvals.map((item: approvalInfo) => (
                  <tr
                    key={item.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          firstName={item.inviter.name.split(" ")[0]}
                          lastName={item.inviter.name.split(" ")[1]}
                        />
                        <div className="text-sm font-medium text-gray-900">
                          {item.inviter.name}
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3">
                      <div>{item.place.name}</div>
                      {item.address}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {new Date(item.request_send_time).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                        }
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <ApprovalStatus status={item.status} />
                    </td>

                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        {item.status === 'pending' ? (
                          <div>
                              <AcceptInvitation item_id={item.id} onAccept={() => changeAfterAccept(item)}/>
                              <DeclineInvitation item_id={item.id} onDecline={() => filterAfterDecline(item)}/>                          
                          </div>
                          
                        ) : ( 
                          item.status === 'accepted' ? (
                            <DeclineInvitation item_id={item.id} onDecline={() => filterAfterDecline(item)} />                          
                          ) : null
                    
                  )}
                        </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
