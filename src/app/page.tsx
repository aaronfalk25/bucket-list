"use client";
import "./global.css";

import { useRouter } from 'next/navigation';
import { SignIn, SignOut, isLoggedIn } from '@/utilities/login';
import { useState, useEffect } from "react";
import { who } from "src/utilities/queries"
import { User } from "src/interfaces/schema";

export default function Home() {
  const router = useRouter();
  const [userLoggedIn, setUserLoggedIn] = useState(isLoggedIn());
  const [user, setUser] = useState(
    {
      uid: '',
      isDarkMode: false,
      isSignedIn: false
    } as unknown as User
  );

  useEffect(() => {
    const getWhoUser = async () => await who();
    const fetchWhoUser = async () => {
      const user = await getWhoUser();
      setUser(user);
      console.log(user);
    };
  
    fetchWhoUser();
  }, []);

  const doLogin = async () => {
    userLoggedIn ? SignOut() : SignIn()
    setUserLoggedIn(!userLoggedIn);
    setUser(await who());
  }

  const handleButtonClick = () => {
    router.push('/events');
  };

  const loginButtonTitle = userLoggedIn ? 'Sign Out' : 'Sign In'
  const additionalText = userLoggedIn && user?.displayName ? `Currently logged in as ${user?.displayName}` : ''

  return (
    <div>
      <div className="container">
          <h1>Home Page</h1>
          <button className="button" onClick ={doLogin}>{loginButtonTitle}</button>
          <p> {additionalText} </p>

          <div><button className="button" onClick ={(e) => who()}>Who</button></div>

          <button className="button-alt" onClick={handleButtonClick}>Go to Another Page</button>
      </div>
    </div>
  )
  }