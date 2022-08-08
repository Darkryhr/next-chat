import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';
import { getChatRef } from '@lib/db';

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
