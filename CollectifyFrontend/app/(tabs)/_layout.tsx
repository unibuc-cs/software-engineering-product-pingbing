import { Tabs } from "expo-router";
import { ApplicationProvider, Button } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { View } from "react-native";
import * as eva from '@eva-design/eva';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
        name="spaces" 
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
  
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <View style={{ marginRight: 10 }}>
          <Button
            size="small"
            appearance="filled"
            onPress={() => router.push('../profile')}
          >
            Profile
          </Button>
        </View>
      </ApplicationProvider>
    );
  }
