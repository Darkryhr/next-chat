import React, { useState } from 'react';
import Image from 'next/image';
import { AiOutlineSend } from 'react-icons/ai';
import { newMessage } from '@lib/db';
import { useAuth } from '@lib/auth';
import { format } from 'date-fns';
import Link from 'next/link';
import { BiChevronLeft } from 'react-icons/bi';

const ChatScreen = ({ children, name }) => {
  return (
    <>
      <div className='box-border overflow-y-scroll w-full h-full flex flex-col pb-[144px]'>
        <div className='flex w-full sm:max-w-none max-w-[200px] mx-auto'>
          <span className='text-sm bg-gray-400 p-2 rounded mx-auto my-3 text-center'>
            This is the start of your conversation with {name}
          </span>
        </div>
        {children}
      </div>
    </>
  );
};

export default ChatScreen;

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
      <div className='sm:hidden block cursor-pointer'>
        <Link href='/'>
          <BiChevronLeft size={30} />
        </Link>
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
      <div className='flex flex-col items-start ml-3'>
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

export const MessageInput = ({ user, chatId, bottomRef }) => {
  const [input, setInput] = useState('');

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const sendMessage = async e => {
    e.preventDefault();
    try {
      await newMessage(user.uid, chatId, input, user.email);
      setInput('');
      scrollToBottom();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form
        className='flex p-4 items-center justify-between bottom-0 left-0 w-full sm:sticky fixed bg-gray-800 border-t border-gray-400'
        onSubmit={sendMessage}
      >
        <input
          type='text'
          placeholder='Type a message'
          className='p-2 rounded w-full bg-gray-700 transition-all ease outline-none focus:ring-1 focus:ring-green-500  focus:border-green-500'
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        {input && (
          <button
            type='submit'
            className='p-1 rounded-full ml-5 transition-all ease-in'
          >
            <AiOutlineSend className='text-green-500' size={24} />
          </button>
        )}
      </form>
    </>
  );
};

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
