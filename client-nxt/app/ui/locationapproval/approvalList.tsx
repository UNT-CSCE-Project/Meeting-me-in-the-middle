"use client";
import { useUser } from "@/app/UserContext";
import { useEffect, useState } from "react";
import { fetchLocationApprovals } from "@/app/lib/locationApproval/data";
import { approvalInfo } from "@/app/lib/locationApproval/definitions";
import { UserAvatar } from "../userAvatar";
import ApprovalStatus from "../locationapproval/status";
import { AcceptInvitation, DeclineInvitation } from "./buttons";

export default function ApprovalList() {
  const [approvals, setApprovals] = useState<approvalInfo[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const { userData } = useUser();
  const [sortConfig, setSortConfig] = useState({
    key: "status",
    direction: "ascending",
  });

  useEffect(() => {
    setIsFetching(true);

    async function fetchData() {
      if (userData && userData.uid) {
        const data = await fetchLocationApprovals(userData?.uid);
        const resolvedData = await Promise.all(
          data.map(async (item) => ({
            ...item,
            address: await item.address, // Resolve the promise here
          }))
        );

        setApprovals(resolvedData);
        setIsFetching(false);
      }
    }
    fetchData();
  }, [userData]);

  // Sorting function based on sortConfig
  const sortedApprovals = [...approvals].sort((a, b) => {
    const key = sortConfig.key as keyof approvalInfo;
    if (a[key] !== null && b[key] !== null) {
      if (a[key] < b[key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

  const requestSort = (key: keyof approvalInfo) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const changeAfterAccept = (item: approvalInfo) => {
    const updatedApprovals = approvals.map((approval) => {
      if (approval.id === item.id) {
        return { ...approval, status: "accepted" };
      }
      return approval;
    });
    setApprovals(updatedApprovals);
  };
  const handleInvite = () => {
    window.location.href = "/midpoint-finder";
  };
  const filterAfterDecline = (item: approvalInfo) => {
    const updatedApprovals = approvals.filter(
      (approval) => approval.id !== item.id
    );
    setApprovals(updatedApprovals);
  };

  return (
    <div className="mt-6 flow-root flex flex-col lg:flex-row h-screen w-full p-6 bg-gray-100">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-blue-50 p-2 md:pt-0 ml-4 mr-4">
          {approvals.length === 0 ? (
            <div className="w-full text-center p-6">
              <i className="fas fa-envelope-open-text text-red-500 text-5xl mb-4"></i>

              {isFetching ? (
                <p className="text-gray-600 text-sm mb-4">
                  Loading location approvals...
                </p>
              ) : (
                <>
                  <p className="text-red-600 italic text-lg mb-2">
                    No pending location approvals!
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Why not send an invitation to a friend or colleague?
                  </p>
                  <button
                    onClick={handleInvite}
                    className="mt-4 px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-150 ease-in-out"
                  >
                    Invite Now
                  </button>
                </>
              )}
            </div>
          ) : (
            !isFetching && (
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-5 font-medium sm:pl-6 cursor-pointer"
                      onClick={() =>
                        requestSort("inviter.name" as keyof approvalInfo)
                      }
                    >
                      Name{" "}
                      {sortConfig.key === "inviter.name" &&
                        (sortConfig.direction === "ascending" ? "▲" : "▼")}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-5 font-medium cursor-pointer"
                      onClick={() =>
                        requestSort("place.name" as keyof approvalInfo)
                      }
                    >
                      Place{" "}
                      {sortConfig.key === "place.name" &&
                        (sortConfig.direction === "ascending" ? "▲" : "▼")}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-5 font-medium cursor-pointer"
                      onClick={() => requestSort("meetingTime")}
                    >
                      Meeting Date{" "}
                      {sortConfig.key === "meetingTime" &&
                        (sortConfig.direction === "ascending" ? "▲" : "▼")}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-5 font-medium cursor-pointer"
                      onClick={() => requestSort("status")}
                    >
                      Status{" "}
                      {sortConfig.key === "status" &&
                        (sortConfig.direction === "ascending" ? "▲" : "▼")}
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {sortedApprovals.map((item) => (
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
                        <br/>
                        <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.address || "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-bold hover:text-blue-700 underline text-sm"
                  >
                    View on Map
                  </a>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {item.meetingTime}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <ApprovalStatus status={item.status} />
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        {item.status === "pending" ? (
                          <div>
                            <AcceptInvitation
                              item_id={item.id}
                              onAccept={() => changeAfterAccept(item)}
                            />
                            <DeclineInvitation
                              item_id={item.id}
                              onDecline={() => filterAfterDecline(item)}
                            />
                          </div>
                        ) : item.status === "accepted" ? (
                          <DeclineInvitation
                            item_id={item.id}
                            onDecline={() => filterAfterDecline(item)}
                          />
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </div>
  );
}
