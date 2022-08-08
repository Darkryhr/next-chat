import React from 'react';
import { format } from 'date-fns';

import { useAuth } from '@lib/auth';

export const ChatMessage = ({ message }) => {
  const { user } = useAuth();
  const messageTime = new Date(message?.timestamp);

  return user.email === message.user ? (
    <div className='w-full p-4 flex justify-end pr-[5vw] hover:bg-gray-700'>
      <div className='flex flex-col items-end space-y-1 p-3 rounded relative bg-gray-500'>
        <p>{message.message}</p>
        <span className='text-xs text-gray-100 font-medium'>
          {message?.timestamp && format(messageTime, 'HH:mm')}
        </span>
        <div className='w-0 h-0 border-x-8 border-t-8 border-gray-500 border-x-transparent absolute -top-1 -right-2'></div>
      </div>
    </div>
  ) : (
    <div className='w-full p-2 hover:bg-gray-700 flex justify-start pl-[5vw]'>
      <div className='flex flex-col items-end space-y-1 p-3 rounded relative bg-zinc-700'>
        <p>{message.message}</p>
        <span className='text-xs text-gray-100 font-medium'>
          {message?.timestamp && format(messageTime, 'HH:mm')}
        </span>
        <div className='w-0 h-0 border-x-8 border-t-8 border-x-transparent border-zinc-700 absolute -top-1 -left-2'></div>
      </div>
    </div>
  );
};
