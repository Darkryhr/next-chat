import React, { useState, useEffect } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import { getLastMessage, getRecipientUserRef } from '@lib/db';
import getSendingToEmail from '@utils/getSendingToEmail';
import { AiOutlineUser } from 'react-icons/ai';
import { useAuth } from '@lib/auth';

export const ChatFeed = ({ snapshot }) => {
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
        className={`flex items-center w-full transition-all hover:pl-6 p-4 cursor-pointer border-t border-gray-500 ${
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
          <div className='bg-gray-500 h-[50px] w-[50px] rounded-full flex items-center justify-center'>
            <AiOutlineUser size={30} className='text-gray-100' />
          </div>
        )}
        <div className='ml-3'>
          <h3 className='font-semibold sm:text-md text-sm'>
            {recipient?.name ? recipient?.name : recipientUser.split('@')[0]}
          </h3>
          <p className='text-gray-100 sm:text-sm text-xs'>{lastMessage}</p>
        </div>
      </div>
    </Link>
  );
};
