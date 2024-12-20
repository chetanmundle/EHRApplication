// src/app/stores/chat.store.ts

import { createInjectable } from 'ngxtension/create-injectable';
import { inject, signal, computed, effect } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  Timestamp,
  query,
  where,
  getDocs,
  orderBy,
  getDoc,
} from '@angular/fire/firestore';
import { useAuthStore, AppUser } from './auth.store';

export interface Chat {
  id: string;
  participants: string[];
  participantNames?: string[];
  lastMessage: string;
  lastMessageTimestamp: Timestamp;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
}

export const useChatStore = createInjectable(() => {
  const firestore = inject(Firestore);
  const authStore = inject(useAuthStore);
  const chats = signal<Chat[]>([]);
  const currentChatId = signal<string | null>(null);
  const messages = signal<Message[]>([]);

  const currentChat = computed(() =>
    chats().find((chat) => chat.id === currentChatId())
  );

  effect(() => {
    const userId = authStore.currentUser()?.uid;
    if (userId) {
      listenToChats(userId);
    }
  });

  async function getUserName(userId: string): Promise<string> {
    const userDoc = await getDoc(doc(firestore, `users/${userId}`));
    if (userDoc.exists()) {
      const userData = userDoc.data() as AppUser;
      return userData.displayName || userData.email || 'Unknown User';
    }
    return 'Unknown User';
  }

  async function fetchParticipantNames(
    participantIds: string[]
  ): Promise<string[]> {
    const names = await Promise.all(participantIds.map(getUserName));
    return names;
  }

  function listenToChats(userId: string) {
    const chatsRef = collection(firestore, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', userId));
    return onSnapshot(q, async (snapshot) => {
      const updatedChats = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const chatData = { id: doc.id, ...doc.data() } as Chat;
          chatData.participantNames = await fetchParticipantNames(
            chatData.participants
          );
          return chatData;
        })
      );
      chats.set(updatedChats);

      // Send notification if a new chat is added
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          // Send notification about new chat
          showNotification('New Chat', 'You have a new chat!');
        }
      });
    });
  }

  function listenToMessages(chatId: string) {
    currentChatId.set(chatId);
    const messagesRef = collection(firestore, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const updatedMessages = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Message)
      );
      messages.set(updatedMessages);

      // Send notification if a new message is added
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newMessage = change.doc.data() as Message;
          if (newMessage.senderId !== authStore.currentUser()?.uid) {
            // Only notify if the message is from another user
            const senderName = getUserName(newMessage.senderId); // Get the sender's name
            showNotification(`New Message : `, newMessage.text);
          }
        }
      });
    });
  }

  async function sendMessage(chatId: string, senderId: string, text: string) {
    const messagesRef = collection(firestore, `chats/${chatId}/messages`);
    const newMessage = {
      chatId,
      senderId,
      text,
      timestamp: Timestamp.now(),
    };
    await addDoc(messagesRef, newMessage);

    // Update the last message in the chat document
    const chatRef = doc(firestore, `chats/${chatId}`);
    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageTimestamp: Timestamp.now(),
    });
  }

  async function createNewChat(participantEmail: string) {
    const currentUser = authStore.currentUser();
    if (!currentUser) throw new Error('You must be logged in to create a chat');

    // Find the user with the given email
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', participantEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('User not found');
    }

    const participantUser = querySnapshot.docs[0].data() as AppUser;

    // Check if a chat already exists between these users
    const existingChatQuery = query(
      collection(firestore, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );
    const existingChatSnapshot = await getDocs(existingChatQuery);

    // Filter the result in memory to check if the participant exists in the same chat
    const existingChat = existingChatSnapshot.docs.find((doc) => {
      const participants = doc.data()['participants']; // Access participants with bracket notation
      return participants && participants.includes(participantUser.uid);
    });

    if (existingChat) {
      // Chat already exists, return its ID
      return existingChat.id;
    }

    // Create a new chat document since no existing chat was found
    const chatsRef = collection(firestore, 'chats');
    const newChat = await addDoc(chatsRef, {
      participants: [currentUser.uid, participantUser.uid],
      lastMessage: '',
      lastMessageTimestamp: Timestamp.now(),
    });

    return newChat.id;
  }

  // async function createNewChat(participantEmail: string) {
  //   const currentUser = authStore.currentUser();
  //   if (!currentUser) throw new Error('You must be logged in to create a chat');

  //   // Find the user with the given email
  //   const usersRef = collection(firestore, 'users');
  //   const q = query(usersRef, where('email', '==', participantEmail));
  //   const querySnapshot = await getDocs(q);

  //   if (querySnapshot.empty) {
  //     throw new Error('User not found');
  //   }

  //   const participantUser = querySnapshot.docs[0].data() as AppUser;

  //   // Check if a chat already exists between these users
  //   const existingChatQuery = query(
  //     collection(firestore, 'chats'),
  //     where('participants', 'in', [currentUser.uid, participantUser.uid])
  //   );
  //   const existingChatSnapshot = await getDocs(existingChatQuery);

  //   if (!existingChatSnapshot.empty) {
  //     // Chat already exists, return its ID
  //     return existingChatSnapshot.docs[0].id;
  //   }

  //   // Create a new chat document
  //   const chatsRef = collection(firestore, 'chats');
  //   const newChat = await addDoc(chatsRef, {
  //     participants: [currentUser.uid, participantUser.uid],
  //     lastMessage: '',
  //     lastMessageTimestamp: Timestamp.now(),
  //   });

  //   return newChat.id;
  // }

  //   async function createNewChat(participantEmail: string) {
  //     const currentUser = authStore.currentUser();
  //     if (!currentUser) throw new Error('You must be logged in to create a chat');

  //     // Find the user with the given email
  //     const usersRef = collection(firestore, 'users');
  //     const q = query(usersRef, where('email', '==', participantEmail));
  //     const querySnapshot = await getDocs(q);

  //     if (querySnapshot.empty) {
  //       throw new Error('User not found');
  //     }

  //     const participantUser = querySnapshot.docs[0].data() as AppUser;

  //     // Check if a chat already exists between these users
  //     const existingChatQuery = query(
  //       collection(firestore, 'chats'),
  //       where('participants', 'array-contains', currentUser.uid),
  //       where('participants', 'array-contains', participantUser.uid)
  //     );
  //     const existingChatSnapshot = await getDocs(existingChatQuery);

  //     if (!existingChatSnapshot.empty) {
  //       // Chat already exists, return its ID
  //       return existingChatSnapshot.docs[0].id;
  //     }

  //     // Create a new chat document
  //     const chatsRef = collection(firestore, 'chats');
  //     const newChat = await addDoc(chatsRef, {
  //       participants: [currentUser.uid, participantUser.uid],
  //       lastMessage: '',
  //       lastMessageTimestamp: Timestamp.now(),
  //     });

  //     return newChat.id;
  //   }

  // Request permission for notifications
  function requestNotificationPermission(): void {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission !== 'granted') {
          console.error('Permission not granted for Notification');
        }
      });
    } else {
      console.error('This browser does not support notifications.');
    }
  }

  // Function to show notification
  function showNotification(title: string, body: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: 'images/EHR.png', // You can change this to any custom icon
        tag: 'new-message-notification',
      });

      notification.onclick = () => {
        window.location.href = '/org/Chat';
      };
    } else {
      console.error('Notification permission is not granted.');
    }
  }

  return {
    chats,
    currentChat,
    messages,
    listenToChats,
    listenToMessages,
    sendMessage,
    createNewChat,
    getUserName,
  };
});
