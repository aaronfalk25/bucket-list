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
  const [groupJoinCode, setGroupJoinCode] = useState<string>("");

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


  // These two useEffect hooks make it so that the page refreshes when the user logs in or out, and when the page first loads
  useEffect(() => {
    const fetchWhoUser = async () => {
      const user = await who();
      setUser(user);
      setUserLoggedIn(user.isSignedIn ?? false);
    };
  
    fetchWhoUser();


    fetchGroups();
  }, [userLoggedIn]);

  useEffect(() => {
    const fetchWhoUser = async () => {
      const user = await who();
      setUser(user);
      setUserLoggedIn(user.isSignedIn ?? false);
    };
  
    fetchWhoUser();

    fetchGroups();
  }, []); 

  const doLogin = async () => {
    userLoggedIn ? await SignOut() : await SignIn()
    setUserLoggedIn(!userLoggedIn);
    setUser(await who());
    window.location.reload();
  }


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

const joinGroup = async (entryCode: string) => {
  const res = await readFromCloudFireStore('groups');
  const fetchedGroups: GroupType[] = res.documents.map(
      (doc) => doc as unknown as GroupType
    );

    try {
      const groupToJoin = fetchedGroups.filter(group => group.entryCode === entryCode.toUpperCase())[0];
      groupToJoin.members.push(user.uid); 
      await writeToCloudFireStore('groups', groupToJoin, groupToJoin.id);
      await fetchGroups();
    }
    catch (error: any) {
      alert("No group with that code exists.")
    }
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
                        <div className='home-my-groups-pane'>
                          
                          <div className="home-page-header-text">Groups I am in</div>

                          {displayMyGroups()}
                          
                          
                          <div className="join-group-container">
                            <form onSubmit={(event) => { 
                              event.preventDefault();
                              joinGroup(groupJoinCode);
                            }} 
                            
                            className="join-group-form">
                              <label htmlFor="name">Join group:</label>
                              <input
                                type="text"
                                id="entryCode"
                                name="entryCode"
                                value={groupJoinCode}
                                onChange={(event) => setGroupJoinCode(event.target.value)}
                                required
                              />
                              <button type="submit">Submit</button>
                            </form>
                          </div>


                        </div>
                        <div className='home-create-group-pane'>
                          <div className="home-page-header-text">Groups I own</div>
                          {displayMyCreatedGroups()}
                          <NewGroup refreshOnGroupCreate={refreshOnGroupCreate} />
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