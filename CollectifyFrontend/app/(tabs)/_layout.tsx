import { Tabs } from "expo-router";
import { ApplicationProvider, Button } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { View } from "react-native";
import * as eva from '@eva-design/eva';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen 
        name="index"
        options={{
            title: "My Notes",
            headerRight: () => <HeaderProfileButton />
        }} />

      <Tabs.Screen 
        name="spaces" 
        options={{
            title: 'My Spaces',
            headerRight: () => <HeaderProfileButton />
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
            status='warning'
            onPress={() => router.push('../profile')}
          >
            Profile
          </Button>
        </View>
      </ApplicationProvider>
    );
  }
