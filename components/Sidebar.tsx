import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import validator from 'email-validator';
import { MdAdd, MdMoreHoriz } from 'react-icons/md';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAuth } from '@lib/auth';
import {
  createChat,
  getChatRef,
  getLastMessage,
  getRecipientUserRef,
} from '@lib/db';
import getSendingToEmail from '@utils/getSendingToEmail';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Loader from './Loader';

const Sidebar = () => {
  const auth = useAuth();
  const userChatRef = getChatRef(auth.user.email);
  const [snapshot, loading, error] = useCollection(userChatRef);
  const router = useRouter();

  if (loading)
    return (
      <div className='flex items-center justify-center w-full h-screen absolute bg-gray-800'>
        <Loader />
      </div>
    );

  return (
    <aside
      className={`bg-gray-800 sm:block grow-0 sm:max-w-[30vw] border-r border-gray-500 w-full ${
        router.query.id ? 'hidden' : ''
      } `}
    >
      <Topbar user={auth.user} snapshot={snapshot} />
      <SearchBar />
      {snapshot.docs && <ChatFeed snapshot={snapshot} />}
    </aside>
  );
};

export default Sidebar;

const Topbar = ({ user, snapshot }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const router = useRouter();

  const chatExists = otherUser =>
    !!snapshot?.docs.find(
      chat => chat.data().users.find(user => user === otherUser)?.length > 0
    );

  const onCreateChat = async () => {
    const input = prompt(
      'Please enter the E-mail of the user you want to chat with'
    );

    if (!input) return;

    if (
      validator.validate(input) &&
      input !== user.email &&
      !chatExists(input)
    ) {
      //* add chat
      const id = await createChat(user.email, input);
      router.push(`/chat/${id}`);
    } else {
      return alert('Invalid E-mail');
    }
  };

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () =>
      document.removeEventListener('click', handleClickOutside, true);
  }, []);

  return (
    <div className='flex w-full justify-between items-center px-4 py-3 bg-transparent h-16 border-b border-b-gray-500'>
      <Image
        src={user?.photoUrl}
        width='40px'
        height='40px'
        alt={user?.name}
        className='rounded-full'
      />
      <div className='flex space-x-2 relative items-center'>
        <button
          type='button'
          className='rounded-full hover:bg-gray-600 p-2 text-gray-100'
          onClick={() => onCreateChat()}
        >
          <MdAdd size={26} />
        </button>
        <span className='bg-gray-300 w-[1px] h-6'></span>
        <button
          type='button'
          className='rounded-full hover:bg-gray-600 p-2 text-gray-100'
          onClick={() => setIsOpen(!isOpen)}
        >
          <MdMoreHoriz size={26} />
        </button>
        <div ref={ref}>{isOpen && <Dropdown close={setIsOpen} />}</div>
      </div>
    </div>
  );
};

export const SearchBar = () => {
  return (
    <form className='px-4 py-2'>
      <div className='bg-gray-700 w-full flex rounded-lg '>
        <button type='submit' className='py-2 px-3'>
          <svg
            aria-hidden='true'
            className='w-5 h-5 text-gray-100'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            ></path>
          </svg>
        </button>
        <input
          type='search'
          className='bg-transparent w-full outline-none'
          placeholder='Search...'
          required
        />
      </div>
    </form>
  );
};

const ChatFeed = ({ snapshot }) => {
  return (
    <div className='overflow-y-scroll h-full'>
      {snapshot?.docs.map(chat => (
        <ChatItem key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </div>
  );
};

const ChatItem = ({ id, users }) => {
  const auth = useAuth();
  const router = useRouter();
  const [lastMessage, setLastMessage] = useState('');
  const recipientUser = getSendingToEmail(users, auth.user.email);
  const recipientRef = getRecipientUserRef(recipientUser);
  const [recipientUserSnapshot, loading] = useCollection(recipientRef);
  const recipient = recipientUserSnapshot?.docs?.[0]?.data();

  useEffect(() => {
    const lastMessage = getLastMessage(id).then(res => {
      setLastMessage(res.data()?.lastMessage);
    });
  });

  if (loading) return null;

  return (
    <Link href={`/chat/${id}`} as={`/chat/${id}`}>
      <div
        className={`flex items-center w-full transition-all hover:pl-6 p-3 cursor-pointer border-t border-gray-500 ${
          id === router.query.id ? 'bg-gray-700' : ''
        }`}
      >
        {recipient ? (
          <Image
            src={recipient?.photoUrl}
            width='50px'
            height='50px'
            className='rounded-full'
            alt={recipient?.name}
          />
        ) : (
          <div className='bg-gray-500 h-[50px] w-[50px] rounded-full'></div>
        )}
        <div className='ml-4'>
          <h3 className='font-semibold sm:text-md text-sm'>
            {recipient?.name ? recipient?.name : recipientUser.split('@')[0]}
          </h3>
          <p className='text-gray-100 sm:text-sm text-xs'>{lastMessage}</p>
        </div>
      </div>
    </Link>
  );
};

const Dropdown = ({ close }) => {
  const { signout } = useAuth();
  return (
    <div className='absolute bg-gray-800 top-12 w-40 -left-20 py-2 border border-gray-500 text-gray-100 rounded'>
      <button
        className='text-sm hover:bg-gray-600 w-full text-left  py-2 px-4'
        onClick={() => close(false)}
      >
        Settings
      </button>
      <button
        className='text-sm hover:bg-gray-600 w-full text-left  py-2 px-4'
        onClick={() => {
          signout();
          close(false);
        }}
      >
        Sign out
      </button>
    </div>
  );
};
