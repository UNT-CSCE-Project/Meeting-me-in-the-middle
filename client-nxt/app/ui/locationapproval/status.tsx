import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';


export default function ApprovalStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-200 text-gray-100': status === 'pending',
          'bg-green-900 text-white': status === 'accepted',
        },
      )}
    >       
      {status === 'pending' ? (
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-gray-600" />
        </>
      ) : null}
      {status === 'accepted' ? (
        <>
          Accepted
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
     
    </span>
  );
}
