import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Button as RNButton } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import api from '../../services/axiosInstance'; // Ensure this points to your API setup
import { getProfile } from '../../services/authService'; 
import { getGroupMembers } from '../../services/groupService';

const ScanScreen = () => {
  const router = useRouter();
  const [groupId, setGroupId] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Reset groupId and loading when navigating back to allow a new scan.
  useEffect(() => {
    setGroupId(null);
    setLoading(false);
  }, [router]);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    setGroupId(data); // QR Code contains groupId
    setLoading(true); // Set loading to true while processing

    try {
      const user = await getProfile(); // Get current user ID
      if (!user || !user.id) {
        Alert.alert("Error", "User not authenticated.");
        setLoading(false);
        return;
      }

      // Check if the user is already in the group using the scanned groupId directly
      const response = await getGroupMembers(data);
      // Extract members from the response (wrapped in $values)
      const members: Array<{ id: string }> = response?.$values ?? [];
      const isUserInGroup = members.some(member => member.id === user.id);

      if (isUserInGroup) {
        Alert.alert("Already in the group", "You are already a member of this group.");
        router.push('/(tabs)/groups');
        setLoading(false);
        return;
      }

      // If not, proceed to add the user
      const addResponse = await api.post('/api/groups/add_member', {
        groupId: data,
        memberId: user.id,
      });

      setLoading(false);

      if (addResponse.status === 200) {
        Alert.alert("Success", "You have been added to the group!");
        router.push('/(tabs)/groups');
      } else {
        Alert.alert("Error", "Failed to join group.");
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Error joining group:", error.response || error);
      Alert.alert("Error", "An error occurred.");
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {groupId === null ? (
        <CameraView
          onBarcodeScanned={handleBarcodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            {loading ? "Joining group..." : "Successfully added to group!"}
          </Text>
          {/* Add a button to reset state and allow re-scanning */}
          <RNButton title="Scan Again" onPress={() => {
            setGroupId(null);
            setLoading(false);
          }} />
        </View>
      )}
    </View>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    alignItems: 'center',
  },
  messageText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
