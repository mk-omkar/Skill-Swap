import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { API_URL } from '@/constants/api';

export type User = {
  id: string;
  email: string;
  name: string;
  bio: string;
  profilePicture?: string;
  skills: string[];
  rating: number;
  totalSessions: number;
  role: 'student' | 'admin';
};

export type AuthUser = User | null;

export type AuthContextType = {
  user: AuthUser;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; message?: string }>;

  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ ok: boolean; message?: string }>;

  signOut: () => Promise<void>;

  updateProfile: (updates: Partial<User>) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: () => Promise.resolve({ ok: false }),
  signUp: () => Promise.resolve({ ok: false }),
  signOut: () => Promise.resolve(),
  updateProfile: () => Promise.resolve(),
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await fetch(
          `${API_URL}/api/users/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return {
            ok: false,
            message: data.error,
          };
        }

        const userData: User = {
          id: data._id,
          email: data.email,
          name: data.name,
          bio: '',
          skills: [],
          rating: 0,
          totalSessions: 0,
          role: 'student',
        };

        setUser(userData);

        await AsyncStorage.setItem(
          'user',
          JSON.stringify(userData)
        );

        return {
          ok: true,
        };
      } catch (error) {
        console.log(error);

        return {
          ok: false,
          message: 'Cannot connect to server',
        };
      }
    },
    []
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      name: string
    ) => {
      try {
        const response = await fetch(
          `${API_URL}/api/users/register`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              email,
              password,
              skillsOffered: [],
              skillsWanted: [],
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return {
            ok: false,
            message: data.error,
          };
        }

        const userData: User = {
          id: data._id,
          email: data.email,
          name: data.name,
          bio: '',
          skills: [],
          rating: 0,
          totalSessions: 0,
          role: 'student',
        };

        setUser(userData);

        await AsyncStorage.setItem(
          'user',
          JSON.stringify(userData)
        );

        return {
          ok: true,
        };
      } catch (error) {
        console.log(error);

        return {
          ok: false,
          message: 'Cannot connect to server',
        };
      }
    },
    []
  );

const signOut = useCallback(async () => {
  try {
    setUser(null);
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.log(error);
  }
}, []);

  const updateProfile = useCallback(
  async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const response = await fetch(
        `${API_URL}/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            updates
          ),
        }
      );

      const data =
        await response.json();

      const updatedUser = {
        ...user,
        ...updates,
      };

      setUser(updatedUser);

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(
          updatedUser
        )
      );
    } catch (error) {
      console.log(error);
    }
  },
  [user]
);

  const value = useMemo(
    () => ({
      user,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }),
    [user, signIn, signUp, signOut, updateProfile]
  );

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}