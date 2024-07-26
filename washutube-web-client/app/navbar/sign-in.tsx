"use client";
import { Fragment } from "react";
import Styles from "./sign-in.module.css";
import { signInWithGoogle, signOut } from "@/utilities/firebase/firebase";
import { User } from "firebase/auth";
interface SignInProps {
    user: User | null;
}

export default function SignIn({ user}: SignInProps) {
    return (
        <Fragment>
            { user ?
            (<button className={Styles.signIn} onClick = {signOut}>
                Sign Out
            </button>)
            : ( <button className={Styles.signIn} onClick = {signInWithGoogle}>
                Sign In
            </button>)
            }
    
        </Fragment>
    )
}