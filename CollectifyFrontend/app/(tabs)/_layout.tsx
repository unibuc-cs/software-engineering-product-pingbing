import React, { useEffect, useState } from 'react';
import { Tabs } from "expo-router";
import { ApplicationProvider, Button } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { View } from "react-native";
import * as eva from '@eva-design/eva';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as SecureStore from 'expo-secure-store';
import { refreshAccessToken } from '../../services/authService';
import { jwtDecode } from 'jwt-decode';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffc94d',
        tabBarStyle: {
          height: 60 // Increase the height of the footer
        },
        tabBarLabelStyle: {
          fontSize: 16 // Increase the font size for the tab labels
        }
      }}
    >
      <Tabs.Screen 
        name="index"
        options={{
            title: "My Notes",
            headerRight: () => <HeaderProfileButton />,
            tabBarIcon: ({ color, focused }) => (
                <FontAwesome name={focused ? 'file' : 'file-o'} color={color} size={27} />
            )
        }} />

      <Tabs.Screen 
        name="groups" 
        options={{
            title: 'My Spaces',
            headerRight: () => <HeaderProfileButton />,
            tabBarIcon: ({ color, focused }) => (
                <FontAwesome name={focused ? 'folder' : 'folder-o'} color={color} size={27} />
            )
        }} />
    </Tabs>
  );
}

function HeaderProfileButton() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // verifica daca userul este logat
  // daca token-ul de acces este expirat, ii da refresh
  useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      
      if (accessToken) {
        const isExpired = isTokenExpired(accessToken);

        if (isExpired) {
          try {
            await refreshAccessToken(); 
            setIsLoggedIn(true); 
          } catch (error) {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(true);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // sterge token-urile daca userul apasa pe log out
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('userEmail');
    setIsLoggedIn(false);
    router.push('../login');
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: { exp: number } = jwtDecode(token); 
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
        {isLoggedIn ? (
          <>
            <Button
              size="small"
              appearance="filled"
              status="warning"
              onPress={() => router.push('../profile')}
              style={{ marginRight: 8 }}
            >
              Profile
            </Button>
            <Button
              size="small"
              appearance="ghost"
              status="danger"
              onPress={handleLogout}
            >
              Log Out
            </Button>
          </>
        ) : (
          <Button
            size="small"
            appearance="filled"
            status="warning"
            onPress={() => router.push('../login')}
          >
            Log In
          </Button>
        )}
      </View>
    </ApplicationProvider>
  );
}
  

