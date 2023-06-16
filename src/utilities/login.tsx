import {auth, provider} from 'src/api/firebase/firebase';
import {signInWithPopup} from "firebase/auth";
import { User } from 'src/interfaces/schema';
import { writeToCloudFireStore, updateIdInCloudFireStore } from 'src/api/firebase/firebase';
import { signOut } from 'firebase/auth';

export async function SignIn() {
    let email: string = '';
    let displayName: string = '';

    await signInWithPopup(auth, provider).then((data) => {

                email = data.user.email ? data.user.email : ''
                displayName = data.user.displayName ? data.user.displayName : ''
              
            });
    
            window.localStorage.setItem('email', email);
            window.localStorage.setItem('displayName', displayName);

            const user: User = {
                uid: auth.currentUser?.uid ? auth.currentUser?.uid : '',
                email: auth.currentUser?.email ? auth.currentUser?.email : '',
                displayName: auth.currentUser?.displayName ? auth.currentUser?.displayName : '',
                firstName: '',
                lastName: '',
                darkMode: false,
                isSignedIn: true
            }
            writeToCloudFireStore('users', user, user.uid);
            updateIdInCloudFireStore('users', user, user.uid);

            window.location.reload();
}

export function SignOut() {
    window.localStorage.removeItem('email');
    window.localStorage.removeItem('displayName');

    const user: User = {
        uid: auth.currentUser?.uid ? auth.currentUser?.uid : '',
        email: auth.currentUser?.email ? auth.currentUser?.email : '',
        displayName: auth.currentUser?.displayName ? auth.currentUser?.displayName : '',
        firstName: '',
        lastName: 'TEST',
        darkMode: false,
        isSignedIn: false
    }
    if (user.uid !== '') {
        writeToCloudFireStore('users', user, user.uid);
        updateIdInCloudFireStore('users', user, user.uid);
        console.log("Wrote to firestore")
    }

    signOut(auth)
    .then(() => {
      // Handle successful sign-out
      console.log('User signed out successfully');
      // Perform any additional actions or state updates
    })
    .catch((error) => {
      // Handle sign-out error
      console.error('Error signing out:', error);
    });

    // window.location.reload();
}

export const isLoggedIn = () => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('email');
      return !!email;
    }
    return false; // Default to not logged in if executed on the server-side
  };