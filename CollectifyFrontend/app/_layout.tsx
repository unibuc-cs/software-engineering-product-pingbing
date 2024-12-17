import { Stack } from "expo-router";

// Define the layout for your app
export default function RootLayout() {
  return (
    <Stack>
      {/* You can specify your screens here */}
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="folders/[item]" />
      <Stack.Screen name="notes/[item]" />
    </Stack>
  );
}
