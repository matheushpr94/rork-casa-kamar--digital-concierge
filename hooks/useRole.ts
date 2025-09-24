import { useState, useEffect } from 'react';
import { LocalStorage } from '@/lib/storage';

type UserRole = 'guest' | 'admin';

export function useRole(): UserRole {
  const [role, setRole] = useState<UserRole>('guest');

  useEffect(() => {
    const checkRole = async () => {
      const adminToken = await LocalStorage.getAdminToken();
      setRole(adminToken ? 'admin' : 'guest');
    };

    checkRole();
  }, []);

  return role;
}