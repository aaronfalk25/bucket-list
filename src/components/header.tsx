import React, { useState, useEffect } from "react";
import { SignIn, SignOut, isLoggedIn } from "@/utilities/login";
import { who } from "src/utilities/queries";
import { User } from "src/interfaces/schema";

export default function Header() {
    const [userLoggedIn, setUserLoggedIn] = useState<Boolean>(isLoggedIn());
    const [user, setUser] = useState(
        {
        uid: "",
        isDarkMode: false,
        isSignedIn: false,
        } as unknown as User
    );
    
    const doLogin = async () => {
        userLoggedIn ? await SignOut() : await SignIn();
        setUserLoggedIn(!userLoggedIn);
        setUser(await who());
        window.location.reload();
    };

    useEffect(() => {
        const fetchWhoUser = async () => {
            const user = await who();
            setUser(user);
            setUserLoggedIn(user.isSignedIn ?? false);
        };
        fetchWhoUser();
    }, []);
    
    const additionalText =
        userLoggedIn && user?.displayName
        ? `Currently logged in as ${user?.displayName}`
        : "";
    
    return (
        <div className="header">
            <h1>Bucket List App</h1>
            
            <div>
                <button className="button" onClick={doLogin}>
                {userLoggedIn ? "Sign Out" : "Sign In"}
                </button>
                <p> {additionalText} </p>
            </div>
        </div>
    );
    }