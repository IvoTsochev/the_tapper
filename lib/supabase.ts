import { LeaderboardType } from '@/types/types';
import { supabase } from './supabase-config';

export const GLOBALS = {
  TABLES: {
    USERS: 'users',
    LEADERBOARD: 'leaderboard',
  },
  BUCKETS: {
    AVATARS: 'avatars_bucket',
  },
};

// CHECK IF USERNAME EXISTS
export const checkUsernameExists = async (enteredUsername: string) => {
  const lowerCaseUsername = enteredUsername.toLowerCase();
  const { data, error } = await supabase
    .from(GLOBALS.TABLES.USERS)
    .select('username')
    .ilike('username', lowerCaseUsername);

  if (error) {
    throw new Error('Username check failed');
  }

  return data;
};

// CHECK IF EMAIL EXISTS
export const checkEmailExists = async (enteredEmail: string) => {
  const lowerCaseEmail = enteredEmail.toLowerCase();
  const { data, error } = await supabase
    .from(GLOBALS.TABLES.USERS)
    .select('email')
    .ilike('email', lowerCaseEmail);

  if (error) {
    throw new Error('Няма регистрация с този имейл.');
  }

  return data;
};

// INSERT USER DATA IN USERS TABLE
const insertUserData = async ({
  userId,
  email,
  username,
}: {
  userId: string;
  email: string;
  username: string;
}) => {
  console.log('Inserting user data:', userId, email, username);

  const { data, error } = await supabase.from(GLOBALS.TABLES.USERS).insert([
    {
      user_id: userId,
      email: email,
      username: username,
    },
  ]);

  if (error) {
    console.log('Insert user data error:', error);
    throw new Error('Unable to add user data. Please try again.');
  }

  return data;
};

export const insertLeaderboardData = async (userId: string) => {
  const { data, error } = await supabase
    .from(GLOBALS.TABLES.LEADERBOARD)
    .insert([{ user_id: userId, taps: 0 }]);

  if (error) {
    console.log('Insert leaderboard data error:', error);
    throw new Error('Unable to add user data. Please try again.');
  }
  return data;
};

// SIGN UP
export const signUp = async (
  username: string,
  email: string,
  password: string
) => {
  console.log('Signing up user:', username, email, password);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) {
    console.log('Sign up error:', error);

    throw new Error('Sign up failed. Please check your details and try again.');
  }

  const userId = data?.user?.id;

  if (!userId) {
    throw new Error('User ID is undefined');
  }

  const userData = await insertUserData({
    userId: userId,
    email,
    username,
  });

  await insertLeaderboardData(userId);

  return {
    error,
    user: data?.user,
  };
};

// SIGN IN
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error('Грешен имейл или парола. Моля, опитайте отново.');
  }

  return {
    data,
    error,
  };
};

// SIGN OUT
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error('Error signing out. Please try again.');
  }
};

// GET USER DATA FROM USERS TABLE
export const getUserData = async ({ userId }: { userId: string }) => {
  if (!userId) {
    throw new Error('getUserData => User not found');
  }

  const { data, error } = await supabase
    .from(GLOBALS.TABLES.USERS)
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error('Unable to fetch user data. Please try again later.');
  }

  return data;
};

export const updateLeaderboardTaps = async (taps: number, user_id: string) => {
  console.log('Updating leaderboard taps:', taps, user_id);

  const { data, error } = await supabase
    .from(GLOBALS.TABLES.LEADERBOARD)
    .update({ taps })
    .eq('user_id', user_id)
    .select();

  console.log('Update leaderboard taps response:', data, error);

  if (error) {
    throw new Error(
      'Unable to update leaderboard taps. Please try again later.'
    );
  }
  return data;
};

// GET TOP 10 LEADERBOARD DATA
export const getTop10LeaderboardData = async () => {
  const { data, error } = await supabase
    .from(GLOBALS.TABLES.LEADERBOARD)
    .select('*')
    .order('taps', { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(
      'Unable to fetch leaderboard data. Please try again later.'
    );
  }

  return (data as LeaderboardType[]) || [];
};

// RESET TAPS
export const resetTaps = async (userId: string) => {
  const { data, error } = await supabase
    .from(GLOBALS.TABLES.LEADERBOARD)
    .update({ taps: 0 })
    .eq('user_id', userId);

  if (error) {
    throw new Error('Unable to reset taps. Please try again later.');
  }

  return data;
};
