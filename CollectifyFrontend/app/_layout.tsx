import { Stack } from "expo-router";
import { ApplicationProvider, Button } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { View } from "react-native";
import * as eva from '@eva-design/eva';

export default function RootLayout() {
  return (
    <Stack>
      {/* Home Screen */}
      <Stack.Screen
        name="index"
        options={{
          title: "Collectify",
          headerRight: () => <HeaderProfileButton />
        }}
      />

      {/* Profile Screen */}
      <Stack.Screen
        name="profile"
        options={{
          title: "User Profile"
        }}
      />

      {/* Folder Screen */}
      <Stack.Screen
        name="folders/[item]"
        options={({ route }) => ({
          title: "Space"
        })}
      />

      {/* Note Screen */}
      <Stack.Screen
        name="notes/[item]"
        options={({ route }) => ({
          title: "Note"
        })}
      />
    </Stack>
  );
}

// Define the custom Home button
function HeaderProfileButton() {
  const router = useRouter();

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <View style={{ marginRight: 10 }}>
        <Button
          size="small"
          appearance="filled"
          onPress={() => router.push('./profile')}
        >
          Profile
        </Button>
      </View>
    </ApplicationProvider>
  );
}
