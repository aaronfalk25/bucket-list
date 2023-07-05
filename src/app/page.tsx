"use client";
import "./global.css";

import { useRouter } from 'next/navigation';
import { SignIn, SignOut, isLoggedIn } from '@/utilities/login';
import { useState, useEffect } from "react";
import { who } from "src/utilities/queries"
import { User, Group } from "src/interfaces/schema";
import { readFromCloudFireStore } from "@/api/firebase/firebase";
import NewGroup from "@/components/NewGroup";

export default function Home() {
  const router = useRouter();
  const [userLoggedIn, setUserLoggedIn] = useState<Boolean>(isLoggedIn());
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [myCreatedGroups, setMyCreatedGroups] = useState<Group[]>([]);
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
      setUserLoggedIn(user.isSignedIn ?? false);
    };
  
    fetchWhoUser();

    const fetchGroups = async () => {
      const res = await readFromCloudFireStore('groups');
      const fetchedGroups: Group[] = res.documents.map(
          (doc) => doc as unknown as Group
        );
      const myGroups: Group[] = fetchedGroups.filter(group => group.members.includes(user.uid));
      setMyGroups(myGroups);

      const myCreatedGroups: Group[] = fetchedGroups.filter(group => group.createdBy === user.uid);
      setMyCreatedGroups(myCreatedGroups);
    }
    fetchGroups();

  }, []);

  const doLogin = async () => {
    userLoggedIn ? await SignOut() : await SignIn()
    setUserLoggedIn(!userLoggedIn);
    setUser(await who());
    window.location.reload();
  }

  const handleButtonClick = () => {
    router.push('/events');
  };

  const refreshOnGroupCreate = async () => {
    const res = await readFromCloudFireStore('groups');
    const fetchedGroups: Group[] = res.documents.map(
        (doc) => doc as unknown as Group
      );
    const myGroups: Group[] = fetchedGroups.filter(group => group.members.includes(user.uid));
    setMyGroups(myGroups);

    const myCreatedGroups: Group[] = fetchedGroups.filter(group => group.createdBy === user.uid);
    setMyCreatedGroups(myCreatedGroups);
  }

  const loginButtonTitle = userLoggedIn ? 'Sign Out' : 'Sign In'
  return (
    <div className="home-page-frame">
      <div className="home-page-container">
          <h1>Eventle</h1>
          <p><i>Your ultimate group event planning tool.</i></p>
          

          {
            userLoggedIn && (
              <div className='home-page-body'>
                <div className='home-my-groups-pane'>Groups I am in</div>
                <div className='home-create-group-pane'>Groups I own
                  <NewGroup refreshOnGroupCreate={refreshOnGroupCreate}/>
                </div>
              </div>
            )
          }

      <div>
        <button className="button" onClick ={doLogin}>{loginButtonTitle}</button>
        {userLoggedIn && <p>Currently signed in as {user?.displayName}</p>}
      </div>
    
    
    
    </div>  
    </div>
  )
  }