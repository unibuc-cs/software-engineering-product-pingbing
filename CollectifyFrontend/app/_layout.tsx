import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen
        name="profile"
        options={{
          title: ""
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          title: ""
        }}
      />

      <Stack.Screen
        name="spaces/[item]"
        options={{
          title: "Space"
        }}
      />

      <Stack.Screen
        name="notes/[item]"
        options={{
          title: "Note"
        }}
      />
    </Stack>
  );
}
