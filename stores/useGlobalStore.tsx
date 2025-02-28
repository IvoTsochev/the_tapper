import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { UserType } from '@/types/types';

type getters = {
  testy: boolean;
  userSession: Session | null;
  isLogged: boolean;
  loading: boolean;
  userData: UserType | null;
  top10LeaderboardData: any;
};

type setters = {
  setTesty: (testy: boolean) => void;
  setUserSession: (session: Session | null) => void;
  setIsLogged: (isLogged: boolean) => void;
  setLoading: (loading: boolean) => void;
  setUserData: (userData: UserType | null) => void;
  setTop10LeaderboardData: (top10LeaderboardData: any) => void;
};

type GlobalStore = getters & setters;

const useGlobalStore = create<GlobalStore>((set, get) => ({
  testy: false,
  setTesty: (testy: boolean) => set({ testy }),
  userSession: null,
  setUserSession: (userSession: any) => set({ userSession }),
  isLogged: false,
  setIsLogged: (isLogged: boolean) => set({ isLogged }),
  loading: true,
  setLoading: (loading: boolean) => set({ loading }),
  userData: null,
  setUserData: (userData: UserType | null) => set({ userData }),
  top10LeaderboardData: null,
  setTop10LeaderboardData: (top10LeaderboardData: any) =>
    set({ top10LeaderboardData }),
}));

export default useGlobalStore;
