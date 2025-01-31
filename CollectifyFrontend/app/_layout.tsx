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
        name="editProfile"
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
        name="groups/[item]"
        options={{
          title: "Spaces"
        }}
      />

      <Stack.Screen
        name="notes/[item]"
        options={{
          title: "Notes"
        }}
      />

      <Stack.Screen
         name = "qrCode"
         options={{
          title: "QRCode"
        }}
        />
         <Stack.Screen
         name = "scan"
         options={{
          title: "Scan"
        }}
        />

    </Stack>
  );
}
