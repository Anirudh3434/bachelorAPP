import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';

export const useAuthUser = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return userId;
};