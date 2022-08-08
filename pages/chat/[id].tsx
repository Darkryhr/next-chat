import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { Timestamp } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

import ChatScreen from '@components/ChatScreen';
import { ChatMessage } from '@components/ChatScreen/ChatMessage';
import { RecipientHeader } from '@components/ChatScreen/Header';
import { MessageInput } from '@components/ChatScreen/MessageInput';
import Loader from '@components/Loader';
import { useAuth } from '@lib/auth';
import {
  getAllChatMessages,
  getChat,
  getMessagesRef,
  getOneChatRef,
  getRecipientUserRef,
} from '@lib/db';
import getSendingToEmail from '@utils/getSendingToEmail';

const ChatSession = ({ messages, chat }) => {
  const { user } = useAuth();
  const router = useRouter();

  const chatUser = getSendingToEmail(chat.users, user.email);
  const recipientRef = getRecipientUserRef(chatUser);

  const [recipientUserSnapshot, loading] = useCollection(recipientRef);
  const recipient = recipientUserSnapshot?.docs?.[0]?.data();

  const messagesRef = getMessagesRef(router.query.id as string);
  const [messagesSnapshot] = useCollection(messagesRef);

  const bottomRef = useRef(null);
  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot?.docs?.map(message => (
        <ChatMessage
          key={message.id}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    }
  };

  if (loading) return <Loader />;

  return (
    <div
      className={`sm:block w-full relative h-full ${
        chat.id === router.query.id ? '' : 'hidden'
      }`}
    >
      <RecipientHeader
        recipient={recipient}
        name={recipient?.name ? recipient?.name : chatUser.split('@')[0]}
        photoUrl={recipient?.photoUrl}
      />
      <ChatScreen
        name={recipient?.name ? recipient?.name : chatUser.split('@')[0]}
      >
        {showMessages()}
        <div ref={bottomRef}></div>
      </ChatScreen>

      <MessageInput
        user={user}
        chatId={router.query.id as string}
        bottomRef={bottomRef}
      />
    </div>
  );
};

export default ChatSession;

interface Message {
  id: string;
  timestamp: Timestamp;
}

export async function getServerSideProps({ params }) {
  const chatRef = getOneChatRef(params.id);

  const messages = (await getAllChatMessages(chatRef.id)).docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((message: Message) => ({
      ...message,
      timestamp: message.timestamp.toDate().getTime(),
    }));

  const chatRes = await getChat(chatRef.id);

  const chatData = chatRes.data();

  const chat = {
    id: chatRes.id,
    ...chatData,
  };
  return {
    props: {
      messages: JSON.stringify(messages),
      chat,
    },
  };
}
