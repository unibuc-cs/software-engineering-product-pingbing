import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import api from '../../services/axiosInstance'; // Ensure this points to your API setup
import { getProfile } from '../../services/authService'; // Get current user ID

const ScanScreen = () => {
    const router = useRouter();
    const [groupId, setGroupId] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarcodeScanned = async ({ data }: { data: string }) => {
        setGroupId(data); // QR Code contains groupId
        try {
            const user = await getProfile(); // Get current user ID
            if (!user || !user.id) {
                Alert.alert("Error", "User not authenticated.");
                return;
            }

            const response = await api.post('/api/group/add_member', {
                groupId: data,
                memberId: user.id // Send memberId instead of userId
            });

            if (response.status === 200) {
                Alert.alert("Success", "You have been added to the group!");
                // If you need to redirect to a generic group page or dashboard after adding the user:
                router.push('./group'); // Redirect to a general group page or dashboard
            } else {
                Alert.alert("Error", "Failed to join group.");
            }
        } catch (error) {
            console.error("Error joining group:", error);
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
            {!groupId ? (
                <CameraView
                    onBarcodeScanned={handleBarcodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            ) : (
                <Text>Joining group...</Text>
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
});
