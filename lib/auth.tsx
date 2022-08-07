import React, { useState, useEffect, useContext, createContext } from 'react';
import Router from 'next/router';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

import { auth } from './firebase';
import { createUser } from './db';
import { serverTimestamp } from 'firebase/firestore';

interface AuthContext {
  user: any;
  loading: boolean;
  signinWithGoogle: () => Promise<void>;
  signout: () => void;
}

const defaultState = {
  user: null,
  loading: false,
  signinWithGoogle: async () => {},
  signout: () => {},
};

const authContext = createContext<AuthContext>(null);

export const useAuth = () => useContext(authContext);

export function AuthProvider({ children }) {
  const authData = useProvideAuth();
  return (
    <authContext.Provider value={authData}>{children}</authContext.Provider>
  );
}

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleUser = async rawUser => {
    if (rawUser) {
      const user = await formatUser(rawUser);
      const { token, ...userWithoutToken } = user;
      createUser(user.uid, userWithoutToken);
      setUser(user);
      setLoading(false);
      return user;
    } else {
      setUser(false);
      setLoading(false);
      return false;
    }
  };

  const signinWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, new GoogleAuthProvider()).then(res => {
      handleUser(res.user);
    });
  };

  const signout = () => {
    Router.push('/');

    signOut(auth).then(() => handleUser(false));
  };

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(handleUser);

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signinWithGoogle,
    signout,
  };
}

const formatUser = async user => {
  const token = await user.getIdToken();

  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    photoUrl: user.photoURL,
    lastSeen: serverTimestamp(),
    token,
  };
};
