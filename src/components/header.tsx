// Header that is displayed on every page
// Contains sign in/ sign out button

import React, { useState } from "react";
import { useRouter } from "next/router";
import { SignIn, SignOut, isLoggedIn } from "@/utilities/login";
import { who } from "src/utilities/queries";
import { User } from "src/interfaces/schema";

export default function Header() {
    const [userLoggedIn, setUserLoggedIn] = useState(isLoggedIn());
    const [user, setUser] = useState(
        {
        uid: "",
        isDarkMode: false,
        isSignedIn: false,
        } as unknown as User
    );
    
    const doLogin = async () => {
        userLoggedIn ? SignOut() : SignIn();
        setUserLoggedIn(!userLoggedIn);
        setUser(await who());
    };
    
    // const handleButtonClick = () => {
    //     router.push("/events");
    // };
    
    const loginButtonTitle = userLoggedIn ? "Sign Out" : "Sign In";
    const additionalText =
        userLoggedIn && user?.displayName
        ? `Currently logged in as ${user?.displayName}`
        : "";
    
    return (
        <div className="header">
            <h1>Bucket List App</h1>
            
            <div>
                <button className="button" onClick={doLogin}>
                {loginButtonTitle}
                </button>
                <p> {additionalText} </p>
            </div>
        </div>
    );
    }