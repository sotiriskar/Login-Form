import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import React, { useState , useEffect } from 'react';
import Login from './Login';
import Main from './Main';
import fire from './Fire';
import './App.css';


const App = () => {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [hasAccount, setHasAccount] = useState(false);
  const auth = getAuth();

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  }

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
  }

  const handleLogin = () => {
    clearErrors();
      signInWithEmailAndPassword(auth, email, password)
      .catch(err => {
        switch(err.code){
          case "auth/invalid-email":
            setEmailError("Your email and/or password do not match");
            break;
          case "auth/user-disabled":
            setEmailError("Your account has been disabled");
            break;
          case "auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError("Your email and/or password do not match");
            break;
        }
      });
  };

  const handleSignUp = () => {
    clearErrors();
    createUserWithEmailAndPassword(auth, email, password)
    .catch(err => {
      switch(err.code){
        case "auth/email-already-in-use":
          setEmailError("That email address is already in use, please use a different email address");
          break;
        case "auth/invalid-email":
          setEmailError("Please enter a valid email address in format:\nyourname@example.com");
          break;
        case "auth/weak-password":
          setPasswordError("The Password must be at least 6 characters Long");
          break;
      }
    });
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const authListener = () => {
    onAuthStateChanged(auth,(user) =>{
      if (user){
        clearInputs();
        setUser(user);
      } else {
        setUser("");
      }
    });
  };

  useEffect(() => {
    authListener();
  },[]);

  return (
    <div className="App">
      <header className="App-header">
        {user ?(
          <Main handleLogout={handleLogout}/>
        ) : (
          <Login 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            handleSignUp={handleSignUp}
            hasAccount={hasAccount}
            setHasAccount={setHasAccount}
            emailError={emailError}
            passwordError={passwordError}
        />
        )}
      </header>
    </div>
  );
}

export default App;
