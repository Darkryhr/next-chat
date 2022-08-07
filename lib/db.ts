import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

export async function createUser(uid, data) {
  await setDoc(doc(db, 'users', uid), { uid, ...data }, { merge: true });
}

export async function createChat(currentUser, otherUser) {
  const docRef = await addDoc(collection(db, 'chats'), {
    users: [currentUser, otherUser],
    lastMessage: '',
  });

  return docRef.id;
}

//TODO: rename to get allChats
export function getChatRef(currentUser) {
  const ref = collection(db, 'chats');
  return query(ref, where('users', 'array-contains', currentUser));

  // const snapshot = await getDoc
}

export function getRecipientUserRef(email: string) {
  return query(collection(db, 'users'), where('email', '==', email));
}

export function getOneChatRef(id) {
  return doc(db, 'chats', id);
}

export async function getAllChatMessages(ref) {
  const q = query(
    collection(db, 'chats', ref, 'messages'),
    orderBy('timestamp', 'asc')
  );
  return await getDocs(q);
}

export function getMessagesRef(chatId: string) {
  return query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'asc')
  );
}

export async function getChat(ref) {
  return await getDoc(doc(db, 'chats', ref));
}

export async function newMessage(
  uid: string,
  chatId: string,
  input: string,
  userEmail: string
) {
  const userDoc = doc(db, 'users', uid);
  await setDoc(
    userDoc,
    {
      lastSeen: serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  await addDoc(collection(db, 'chats', chatId, 'messages'), {
    timestamp: serverTimestamp(),
    message: input,
    user: userEmail,
  });

  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: input,
  });
}

export async function getLastMessage(chatId: string) {
  const ref = doc(db, 'chats', chatId);
  return await getDoc(ref);
}
