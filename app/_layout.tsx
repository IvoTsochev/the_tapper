import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { Alert, useColorScheme } from 'react-native';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase-config';
import useGlobalStore from '@/stores/useGlobalStore';
import { getUserData } from '@/lib/supabase';
import CustomDrawer from '@/components/CustomDrawer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { setLoading, setUserSession, setIsLogged, setUserData, userSession } =
    useGlobalStore();

  const queryClient = new QueryClient();

  useEffect(() => {
    try {
      supabase.auth.onAuthStateChange((event, session) => {
        setUserSession(session);
        setIsLogged(!!session);
      });
    } catch (error) {
      console.error('Error fetching user session', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchUserDataWithRetry = async (
      userId: string,
      attempts = 3,
      delay = 1000
    ) => {
      for (let i = 0; i < attempts; i++) {
        try {
          const data = await getUserData({ userId });
          if (data) {
            setUserData(data);
            return;
          }
        } catch (error) {
          console.log(`Attempt ${i + 1} failed: Retrying...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
      throw new Error('Unable to fetch user data after multiple attempts.');
    };

    const attemptFetch = async () => {
      if (userSession) {
        const userId = userSession?.userId || userSession?.user?.id;
        if (userId) {
          try {
            await fetchUserDataWithRetry(userId);
          } catch (error: any) {
            console.error(error.message);
            Alert.alert(
              'Упс',
              'Възникна грешка при зареждането на потребителските данни.'
            );
          }
        }
      }
    };

    attemptFetch();
  }, [userSession]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Drawer
          drawerContent={(props) => <CustomDrawer {...props} />}
          screenOptions={{
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
            },
            headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
            drawerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
            },
            drawerActiveTintColor: '#3B82F6',
            drawerInactiveTintColor:
              colorScheme === 'dark' ? '#FFFFFF' : '#000000',
          }}
        ></Drawer>
      </QueryClientProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}
