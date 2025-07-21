import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../Firebase/firebase.config";
import { GoogleAuthProvider } from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth";
import axios from "axios";

const gitHubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();
export const AuthContext = createContext(null)
function AuthProvider({children}) {
    const [users, setUsers] = useState(null)
    const [loading, setLoading] = useState(true)

    const creatUser = (email, password) =>{
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const updateUser =(name, photo) =>{
        setLoading(true)
        return updateProfile(auth.currentUser, {
            displayName: name,
             photoURL: photo
          })
    } 

    const loginUser = (email, password)=>{
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }
    const googleLogin = ()=>{
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }
    const gitHubLogin = () =>{
        setLoading(true)
        return signInWithPopup(auth, gitHubProvider)
    }
    const logOutUser = () =>{
        setLoading(true)
        return signOut(auth);
    }
    const value = {
        creatUser,
        updateUser,
        loginUser,
        googleLogin,
        gitHubLogin,
        loading,
        users,
        logOutUser
    }
    useEffect(()=>{
        const unSubscribe = onAuthStateChanged(auth, currentUser=>{
            const userEmail = currentUser?.email || users?.email;
            const loggedUser = {email: userEmail};
            setUsers(currentUser)
            setLoading(false)
            if(currentUser){
                axios.post('https://career-peak-server.vercel.app/jwt', loggedUser,{
                    withCredentials: true
                })
                .then(res=>{
                    console.log('token response', res.data);
                })
            }
            else{
                axios.post('https://career-peak-server.vercel.app/logout', loggedUser,{
                    withCredentials: true
                })
                .then(res => {

                    console.log(res.data);

                })
            }

        });
        return()=>{
            unSubscribe();
        }
    },[])
    console.log(users);
  return (
    <AuthContext.Provider value={value}>
    {children}
</AuthContext.Provider>
  )
}

export default AuthProvider