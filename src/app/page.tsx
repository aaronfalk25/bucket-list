"use client";
import "./global.css";

import { useRouter } from 'next/navigation';
import { SignIn, SignOut, isLoggedIn } from '@/utilities/login';
import { useState, useEffect } from "react";
import { who } from "src/utilities/queries"
import { User, Group as GroupType, BucketItem } from "src/interfaces/schema";
import { deleteFromCloudFireStore, readFromCloudFireStore, writeToCloudFireStore } from "@/api/firebase/firebase";
import NewGroup from "@/components/NewGroup";
import Group from "@/components/Group";
import { read } from "fs";

export default function Home() {
  const router = useRouter();
  const [userLoggedIn, setUserLoggedIn] = useState<Boolean>(isLoggedIn());
  const [myGroups, setMyGroups] = useState<GroupType[]>([]);
  const [myCreatedGroups, setMyCreatedGroups] = useState<GroupType[]>([]);
  const [user, setUser] = useState(
    {
      uid: '',
      isDarkMode: false,
      isSignedIn: false
    } as unknown as User
  );

  const fetchGroups = async () => {
    const res = await readFromCloudFireStore('groups');
    const fetchedGroups: GroupType[] = res.documents.map(
        (doc) => doc as unknown as GroupType
      );
    const myGroups: GroupType[] = fetchedGroups.filter(group => group.members.includes(user.uid));
    setMyGroups(myGroups);

    const myCreatedGroups: GroupType[] = fetchedGroups.filter(group => group.createdBy === user.uid);
    setMyCreatedGroups(myCreatedGroups);
  }

  useEffect(() => {
    const fetchWhoUser = async () => {
      const user = await who();
      setUser(user);
      setUserLoggedIn(user.isSignedIn ?? false);
    };
  
    fetchWhoUser();


    fetchGroups();
  }, [userLoggedIn, myCreatedGroups, myGroups]);

  const doLogin = async () => {
    userLoggedIn ? await SignOut() : await SignIn()
    setUserLoggedIn(!userLoggedIn);
    setUser(await who());
    window.location.reload();
  }

  const handleButtonClick = () => {
    router.push('/events');
  };

  const setUserSelectedGroup = async (groupId: string) => {
    user.userSelectedGroup = groupId;
    setUser(user);
    await writeToCloudFireStore('users', user, user.uid);
  }

  const refreshOnGroupCreate = async () => {
    const res = await readFromCloudFireStore('groups');
    const fetchedGroups: GroupType[] = res.documents.map(
        (doc) => doc as unknown as GroupType
      );
    const myGroups: GroupType[] = fetchedGroups.filter(group => group.members.includes(user.uid));
    setMyGroups(myGroups);

    const myCreatedGroups: GroupType[] = fetchedGroups.filter(group => group.createdBy === user.uid);
    setMyCreatedGroups(myCreatedGroups);
  }

  const displayMyCreatedGroups = () => {
      return myCreatedGroups.map(group => <Group key={group.id} 
        {...group} 
        setUserSelectedGroup={() => setUserSelectedGroup(group.id)} 
        deleteGroup={() => deleteGroup(group.id)}
        />)}

  const displayMyGroups = () => {return myGroups.map(group => <Group key={group.id} {...group} setUserSelectedGroup={() => setUserSelectedGroup(group.id)} />)}

  const deleteGroup = async (groupid: string) => {
    if (groupid === user.userSelectedGroup) {
       user.userSelectedGroup = "";
      setUser(user); 
    }

    await writeToCloudFireStore('users', user, user.uid);

    await readFromCloudFireStore('bucketItems').then(res => {
      const fetchedBucketItems = res.documents.map(
        (doc) => doc as unknown as BucketItem
      );
      const bucketItemsToDelete = fetchedBucketItems.filter(bucketItem => bucketItem.groupId === groupid);
      bucketItemsToDelete.forEach(async bucketItem => await deleteFromCloudFireStore('bucketItems', bucketItem.id));
    });

    await deleteFromCloudFireStore("groups", groupid);
    fetchGroups();
};


  const loginButtonTitle = userLoggedIn ? 'Sign Out' : 'Sign In'
  return (
    <div className="home-page-frame">
      <div className="home-page-container">
          <h1>Eventle</h1>
          <p><i>Your ultimate group event planning tool.</i></p>
          

          {
            userLoggedIn && (
              <div className='home-page-body'>
                <div className='home-my-groups-pane'>Groups I am in
                  {displayMyGroups()}
                </div>
                <div className='home-create-group-pane'>Groups I own
                {displayMyCreatedGroups()}
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