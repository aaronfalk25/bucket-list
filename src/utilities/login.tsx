import {auth, provider} from 'src/api/firebase/firebase';
import {signInWithPopup} from "firebase/auth";
import { User } from 'src/interfaces/schema';
import { writeToCloudFireStore } from 'src/api/firebase/firebase';
import { signOut } from 'firebase/auth';
import {who} from 'src/utilities/queries';

export async function SignIn() {
    await signInWithPopup(auth, provider); // Sign in with Google
    
    // Make user object
    const user: User = {
        uid: auth.currentUser?.uid ? auth.currentUser?.uid : '',
        email: auth.currentUser?.email ? auth.currentUser?.email : '',
        displayName: auth.currentUser?.displayName ? auth.currentUser?.displayName : '',
        firstName: auth.currentUser?.displayName ? auth.currentUser?.displayName.split(' ')[0] : '',
        lastName: auth.currentUser?.displayName ? auth.currentUser?.displayName.split(' ')[1] : '',
        darkMode: false,
        isSignedIn: true,
        userSelectedGroup: ''
    }

    // Write user object to firestore (user storage)
    await writeToCloudFireStore('users', user, user.uid);
}

export async function SignOut() {
    const whoUser = await who();

    if (whoUser.uid === "") {
      throw new Error("User not found");
    }

    const user: User = {
        uid: whoUser.uid,
        email: whoUser?.email,
        displayName: whoUser?.displayName,
        firstName: whoUser?.firstName,
        lastName: whoUser?.lastName,
        darkMode: whoUser?.darkMode,
        isSignedIn: false,
        userSelectedGroup: ''
    }
    if (user.uid !== '') {
      await writeToCloudFireStore('users', user, user.uid);
    }

    signOut(auth)
    // .then(() => {
    //   // Handle successful sign-out
    //   console.log('User signed out successfully');
    // })
    .catch((error) => {
      // Handle sign-out error
      console.error('Error signing out:', error);
    });
}


import { getAuth, User as FBUser } from 'firebase/auth';

export const isLoggedIn = (): boolean => {
  const auth = getAuth();
  const user: FBUser | null = auth.currentUser;
  return !!user;
};