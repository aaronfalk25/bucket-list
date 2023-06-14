"use client";
import "./global.css";

import { useRouter } from 'next/navigation';
import { SignIn, SignOut, isLoggedIn } from '@/utilities/login';

export default function Home() {
  const router = useRouter();

  const doLogin = () => {
    isLoggedIn() ? SignOut() : SignIn()    
  }

  const handleButtonClick = () => {
    router.push('/events');
  };

  const loginButtonTitle = isLoggedIn() ? 'Sign Out' : 'Sign In'
  const additionalText = isLoggedIn() ? `Currently logged in as ${window.localStorage.getItem('displayName')}` : ''

  return (
    <div>
      <div className="container">
          <h1>Home Page</h1>
          <button className="button" onClick ={doLogin}>{loginButtonTitle}</button>
          <p> {additionalText} </p>

          <button className="button-alt" onClick={handleButtonClick}>Go to Another Page</button>
      </div>
    </div>
  )
}
