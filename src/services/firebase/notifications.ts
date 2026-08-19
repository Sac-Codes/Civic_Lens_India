import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where, type Unsubscribe } from 'firebase/firestore';
import type { ActivityNotification } from '../../types';
import { firestore } from './config';

function requireFirestore() {
  if (!firestore) throw new Error('Firebase Firestore is not configured.');
  return firestore;
}

export function subscribeToUserNotifications(userId: string, callback: (notifications: ActivityNotification[]) => void, onError: (error: Error) => void): Unsubscribe {
  const db = requireFirestore();
  return onSnapshot(query(collection(db, 'notifications'), where('recipientId', '==', userId)), (snapshot) => {
    callback(snapshot.docs.map((item) => {
      const data = item.data();
      return { id: item.id, ...data, isRead: data.isRead ?? data.read ?? false } as ActivityNotification;
    }));
  }, onError);
}

export async function saveNotification(notification: ActivityNotification, recipientId: string): Promise<void> {
  const db = requireFirestore();
  await setDoc(doc(db, 'notifications', notification.id), {
    ...notification,
    recipientId,
    read: false,
  });
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const db = requireFirestore();
  await setDoc(doc(db, 'notifications', notificationId), { read: true, isRead: true }, { merge: true });
}

export async function deleteNotification(notificationId: string): Promise<void> {
  const db = requireFirestore();
  await deleteDoc(doc(db, 'notifications', notificationId));
}