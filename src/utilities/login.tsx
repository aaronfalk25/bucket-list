import {auth,provider} from 'src/api/firebase/firebase';
import {signInWithPopup} from "firebase/auth";

export async function SignIn() {
    let email: string = '';
    let displayName: string = '';

    await signInWithPopup(auth, provider).then((data) => {

                email = data.user.email ? data.user.email : ''
                displayName = data.user.displayName ? data.user.displayName : ''
              
            });

            window.localStorage.setItem("email", email)
            window.localStorage.setItem("displayName", displayName)
            window.location.reload();
}

export function SignOut() {
    window.localStorage.removeItem('email');
    window.localStorage.removeItem('displayName');
    window.location.reload();
}

export const isLoggedIn = () => !!localStorage.getItem('email')