"use client";

import {auth,provider} from 'src/api/firebase/firebase';
import { useEffect, useState } from 'react';
import {signInWithPopup} from "firebase/auth";
import Home from 'src/app/page.tsx';

function SignIn() {
    const [value, setValue] = useState('');
    const handleClick = () => {
        signInWithPopup(auth, provider).then((data) => {
            setValue(data.user.email)
            localStorage.setItem("email",data.user.email)
        })
    }

    useEffect(() => {
        setValue(localStorage.getItem('email'))
    })

    return (<div>
        {value?<Home/>:
        <button onClick={handleClick}>Signin With Google</button>
        }
    </div>)
}

export default SignIn;