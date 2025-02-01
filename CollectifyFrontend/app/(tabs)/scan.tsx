import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraView } from 'expo-camera';
import { IQRCodePayload } from '../../src/library/IQRCodePayload';
import { useRouter } from 'expo-router';

const ScanScreen = () => {
    const router = useRouter();
    const [scanData, setScanData] = useState<IQRCodePayload | undefined>(undefined);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [cameraKey, setCameraKey] = useState(0); // Key to force re-mount camera on scan again

    // Request camera permission
    const requestPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    // Pick image from gallery and scan QR code
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            scanQRCodeFromImage(result.assets[0].uri);
        }
    };

    // Scan QR code from image
    const scanQRCodeFromImage = async (uri: string) => {
        try {
            const scannedResults = await Camera.scanFromURLAsync(uri);
            if (scannedResults.length > 0) {
                const qrData = scannedResults[0].data;
                const parsedData: IQRCodePayload = JSON.parse(qrData);
                setScanData(parsedData);
                console.log('Scanned QR Code Data:', parsedData);
            } else {
                alert('No QR Code found');
            }
        } catch (error) {
            console.error('Error scanning QR code:', error);
            alert('Error scanning QR Code');
        }
    };

    // Scan QR code live from camera
    const handleBarcodeScanned = ({ type, data }: any) => {
        try {
            const parsedData: IQRCodePayload = JSON.parse(data);
            setScanData(parsedData);
            alert(`Scanned QR Code: ${data}`);
        } catch (error) {
            console.error('Unable to parse QR code: ', error);
        }
    };

    // Reset the scan state for re-scanning
    const resetScanner = () => {
        setScanData(undefined);
        setImageUri(null);
        setCameraKey(prevKey => prevKey + 1); // Force re-mount the camera view
    };

    // Render the view depending on the permission and scan data
    useEffect(() => {
        requestPermission();
    }, []);

    if (hasPermission === null) {
        return <Text>Requesting permission...</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            {!scanData ? (
                <>
                    {/* Button for picking an image */}
                    <Button title="Pick an Image" onPress={pickImage} />
                    {/* Camera View for live scanning */}
                    <CameraView
                        key={cameraKey}  // Forces re-mount on scan again
                        onBarcodeScanned={handleBarcodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                </>
            ) : (
                <>
                    {/* Display the scanned QR code data */}
                    <Text>Scanned Data: {JSON.stringify(scanData, null, 2)}</Text>
                    {/* Button for re-scanning */}
                    <Button title="Scan Again" onPress={resetScanner} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ScanScreen;
