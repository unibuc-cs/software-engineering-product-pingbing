import React, { useEffect, useState } from 'react';
import { Tabs, Stack } from "expo-router";
import { ApplicationProvider, Button } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { View } from "react-native";
import * as eva from '@eva-design/eva';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as SecureStore from 'expo-secure-store';



export default function TabLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // `null` indicates loading state

  // Check login status
  const checkLoginStatus = async () => {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    if (accessToken) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    // Render a loading state while login status is being determined
    return <View />;
  }

  if (!isLoggedIn) {
    // Render only the Stack layout for logged-out users
    return (
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false
          }}
        />
      </Stack>
    );
  }

  // Render Tabs for logged-in users
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: '#ffc94d',
        tabBarStyle: {
          height: 60, // Increase the height of the footer
        },
        tabBarLabelStyle: {
          fontSize: 16, // Increase the font size for the tab labels
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Notes",
          headerRight: () => (
            <HeaderProfileButton refreshLoginStatus={checkLoginStatus} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name={focused ? 'file' : 'file-o'} color={color} size={27} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'My Spaces',
          headerRight: () => (
            <HeaderProfileButton refreshLoginStatus={checkLoginStatus} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name={focused ? 'folder' : 'folder-o'} color={color} size={27} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          headerRight: () => (
            <HeaderProfileButton refreshLoginStatus={checkLoginStatus} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome name={focused ? 'file' : 'file-o'} color={color} size={27} />
          ),
        }}
      />
    </Tabs>
  );
}



function HeaderProfileButton({ refreshLoginStatus }: { refreshLoginStatus: () => void }) {
  const router = useRouter();

  const handleLogout = async () => {
    const keys = ['accessToken', 'refreshToken', 'userEmail', 'nickname', 'avatarPath', 'avatarUri'];

    for (const key of keys) {
      await SecureStore.deleteItemAsync(key);
    }

    refreshLoginStatus(); // Notify the parent to refresh the login state
    router.push('../login'); // Redirect to the login page
  };

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
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
      </View>
    </ApplicationProvider>
  );
}
