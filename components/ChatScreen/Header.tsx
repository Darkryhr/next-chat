import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BiChevronLeft } from 'react-icons/bi';
import { format } from 'date-fns';

export const RecipientHeader = ({ name = '', photoUrl = null, recipient }) => {
  const lastSeen = new Date(recipient?.lastSeen.toDate().getTime());
  const today = new Date();
  const lastSeenToday = () => {
    if (today.toDateString() === lastSeen.toDateString())
      return 'Today at ' + format(lastSeen, 'HH:mm');
    else return format(lastSeen, 'MMM, do');
  };

  return (
    <div className='w-full py-4 sm:px-4 px-0 border-b border-gray-400 flex items-center h-16 relative bg-gray-800 z-10'>
      <Link href='/'>
        <div className='flex transition items-center justify-center hover:bg-gray-400 py-1 px-2 ml-1 rounded-full  cursor-pointer'>
          <div className='sm:hidden block'>
            <BiChevronLeft size={30} />
          </div>
          {photoUrl ? (
            <Image
              src={photoUrl}
              width='38vw'
              height='38vw'
              className='rounded-full'
              alt={name}
            />
          ) : (
            <div className='h-10 w-10 rounded-full bg-gray-500'></div>
          )}
        </div>
      </Link>

      <div className='flex flex-col items-start ml-1'>
        <span className='font-semibold'>{name}</span>
        {recipient && (
          <p className='text-sm text-gray-100'>
            Last seen {lastSeenToday() || ''}
          </p>
        )}
      </div>
    </div>
  );
};
