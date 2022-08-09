import React, { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { BsArrowLeftShort } from 'react-icons/bs';
import { IoMdSend } from 'react-icons/io';
import { useRouter } from 'next/router';
import { getChatRef } from '@lib/db';
import validator from 'email-validator';

import { createChat } from '@lib/db';
import { SearchBar } from './Searchbar';
import { useAuth } from '@lib/auth';
import { ChatFeed } from './Chats';
import { Topbar } from './Topbar';
import Loader from '../Loader';

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
    <>
      <aside
        className={`bg-gray-800 sm:block grow-0 sm:max-w-[30vw] border-r border-gray-500 w-full ${
          router.query.id ? 'hidden' : ''
        } `}
      >
        <Topbar user={auth.user} snapshot={snapshot} />
        <SearchBar />
        {snapshot.docs && <ChatFeed snapshot={snapshot} />}
      </aside>
    </>
  );
};

export default Sidebar;

export const AddChat = ({ user, snapshot, setOpen }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const chatExists = otherUser =>
    !!snapshot?.docs.find(
      chat => chat.data().users.find(user => user === otherUser)?.length > 0
    );

  const onCreateChat = async e => {
    e.preventDefault();

    if (!input) return;

    if (
      validator.validate(input) &&
      input !== user.email &&
      !chatExists(input)
    ) {
      //* add chat
      const id = await createChat(user.email, input);
      setOpen(false);
      setInput('');
      router.push(`/chat/${id}`);
    } else {
      setError(true);
      return;
    }
  };

  return (
    <>
      <div className='pt-10 pb-5 bg-gray-900 flex items-center border-b border-gray-500 '>
        <button
          className='mx-6'
          onClick={() => {
            setInput('');
            setError(false);
            setOpen(false);
          }}
        >
          <BsArrowLeftShort size={30} />
        </button>
        <h2 className='font-semibold text-xl'>New Chat</h2>
      </div>
      <form className='px-4 py-2' onSubmit={onCreateChat}>
        <div className='bg-gray-700 w-full flex rounded-lg '>
          <input
            type='search'
            className='bg-transparent w-full outline-none pl-3'
            placeholder='Search...'
            required
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type='submit' className='py-2 px-3'>
            <IoMdSend className='text-gray-100' />
          </button>
        </div>
      </form>
      {error && input && (
        <p className='text-sm text-red-400 px-6 py-2'>Invalid E-mail!</p>
      )}
    </>
  );
};
