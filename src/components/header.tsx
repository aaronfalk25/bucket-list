import React, { useState, useEffect } from "react";
import { SignIn, SignOut, isLoggedIn } from "@/utilities/login";
import { who } from "src/utilities/queries";
import { User, Group } from "src/interfaces/schema";
import { useRouter } from 'next/navigation';
import { readFromCloudFireStore } from "@/api/firebase/firebase";

export default function Header() {
    const router = useRouter();
    const [userLoggedIn, setUserLoggedIn] = useState<Boolean>(isLoggedIn());
    const [user, setUser] = useState(
        {
        uid: "",
        isDarkMode: false,
        isSignedIn: false,
        } as unknown as User
    );
    const [userGroup, setUserGroup] = useState<string>("");
    
    const doLogin = async () => {
        userLoggedIn ? await SignOut() : await SignIn();
        setUserLoggedIn(!userLoggedIn);
        setUser(await who());
        if (userLoggedIn) router.push('/');
    };

    const fetchUserGroup = async () => {
        if (!user.userSelectedGroup) return;

        const groups = await readFromCloudFireStore('groups');
        const userGroup = groups.documents.filter((group) => group.id === user.userSelectedGroup)[0] as unknown as Group;
        console.log(user);
        console.log(userGroup);
        setUserGroup(userGroup.name);
    }
        

    useEffect(() => {
        const fetchWhoUser = async () => {
            const user = await who();
            setUser(user);
            setUserLoggedIn(user.isSignedIn ?? false);
        };
        fetchWhoUser();
    }, []);

    useEffect(() => {
        fetchUserGroup();
    }, [user]);
    
    const additionalText =
        userLoggedIn && user?.displayName
        ? `Currently logged in as ${user?.displayName}`
        : "";
    
    return (
        <div className="header">
            <div className="header-row">
                <h1> {userGroup} Group </h1>
                
                <div>
                    <button className="button" onClick={doLogin}>
                    {userLoggedIn ? "Sign Out" : "Sign In"}
                    </button>
                </div>
            </div>

            <div className="header-row"> 
                <button className="button" onClick={() => router.push('/')}>Return Home</button>
                <p> {additionalText} </p>
            </div>
        </div>
    );
    }