import React, { useState, useEffect, useRef } from 'react';
import { MdAdd, MdMoreHoriz } from 'react-icons/md';
import validator from 'email-validator';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { createChat } from '@lib/db';
import { useAuth } from '@lib/auth';
import { AddChat } from '.';

export const Topbar = ({ user, snapshot }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newChat, setNewChat] = useState(false);
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
    <>
      <div className='flex w-full justify-between items-center px-4 py-3 bg-transparent h-16 border-b border-b-gray-500'>
        <Image
          src={user?.photoUrl}
          width='40px'
          height='40px'
          alt={user?.name}
          className='rounded-full'
        />
        <div className='flex space-x-2 relative items-center' ref={ref}>
          <button
            type='button'
            className='rounded-full hover:bg-gray-600 p-2 text-gray-100'
            onClick={() => setNewChat(true)}
          >
            <MdAdd size={26} />
          </button>
          <span className='bg-gray-300 w-[1px] h-6'></span>
          <button
            type='button'
            className='rounded-full hover:bg-gray-600 focus-within:bg-gray-600 p-2 text-gray-100'
            onClick={e => {
              setIsOpen(prev => !prev);
              e.stopPropagation();
            }}
          >
            <MdMoreHoriz size={26} />
          </button>
          <div
            className={`absolute transition origin-top-right transform bg-gray-800 top-12
        -left-[5.3rem] py-2 border border-gray-500 text-gray-100 rounded
        ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        `}
          >
            <Dropdown close={setIsOpen} />
          </div>
        </div>
      </div>

      <aside
        className={`bg-gray-800 transition origin-left duration-300 sm:block grow-0 sm:max-w-[30vw] border-r border-gray-500 w-full absolute top-0 left-0 h-screen z-50
        ${newChat ? 'translate-x-0' : '-translate-x-[100vw]'}
        `}
      >
        <AddChat user={user} snapshot={snapshot} setOpen={setNewChat} />
      </aside>
    </>
  );
};

const Dropdown = ({ close }) => {
  const { signout } = useAuth();
  return (
    <>
      <button
        className='sm:text-sm transition-colors hover:bg-gray-600 w-full text-left  p-4'
        onClick={() => close(false)}
      >
        Settings
      </button>
      <button
        className='sm:text-sm transition-colors hover:bg-gray-600 w-full text-left  p-4'
        onClick={() => {
          signout();
          close(false);
        }}
      >
        Sign out
      </button>
    </>
  );
};
