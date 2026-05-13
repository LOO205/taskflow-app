import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setAuthToken } from '../api/axios';

export default function AuthTokenSync() {
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return null;
}
