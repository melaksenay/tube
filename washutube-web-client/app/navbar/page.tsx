"use client";
import Image from "next/image";
import Link from "next/link";
import Styles from "./navbar.module.css";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "@/utilities/firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Upload from "./upload";

export default function Navbar () {
    //initialize user state
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => { 
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });
        
        return () => unsubscribe();
    });
    
    // return (
    //     <nav className= {Styles.nav}>
    //         <Link href = "/"> 
    //             <Image width={100} height={20} 
    //             src ="/washubear.svg" alt = "WashU Logo"/>       
    //         </Link>
    //         {
    //             user && <Upload />
    //         }
    //         <SignIn user={user} />
    //     </nav>
    // );

    return (
        <nav className={Styles.nav}>
          <Link href="/">
            <Image width={90} height={20}
              src="/washubear.svg" alt="WashU Logo"/>
          </Link>
          { 
            <Upload />
          }
          <SignIn user={user} />
        </nav>
      );
}