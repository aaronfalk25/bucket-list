import { readFromCloudFireStore } from 'src/api/firebase/firebase';
import { getAuth } from 'firebase/auth';
import { User } from 'src/interfaces/schema';
import {Collection} from 'src/interfaces/firestore';

export async function who(): Promise<User> {
  const users: Collection = await readFromCloudFireStore('users');

  const auth = getAuth();
  const userid: string | undefined = auth.currentUser?.uid;

  let user: User = {
    uid: "",
    darkMode: false,
    isSignedIn: false
  };

  if (userid !== undefined) {
  
    for (const usr of users.documents) {
        if (usr.uid === userid && usr.isSignedIn) {
          user = usr as unknown as User;
        }
    }
  }

  return user;
}

export async function getUserById(uid: string): Promise<User> {
  const users: Collection = await readFromCloudFireStore('users');

  let user: User = {
    uid: "",
    darkMode: false,
    isSignedIn: false
  };

  for (const usr of users.documents) {
      if (usr.uid === uid) {
        user = usr as unknown as User;
      }
  }

  return user;
}