import React, { useState, useEffect } from 'react';
import { CameraView, Camera, BarcodeScanningResult } from 'expo-camera';
import * as ImagePicker from "expo-image-picker";
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { IQRCodePayload } from '../../src/library/IQRCodePayload';

const ScanScreen = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [scanData, setScanData] = useState<IQRCodePayload>();
    const [permission, setPermission] = useState<boolean | null>(null);

    useEffect(() => {
        requestCameraPermission();
    }, []);

    const requestCameraPermission = async () => {
        try {
            const { status, granted } = await Camera.requestCameraPermissionsAsync();
            setPermission(status === 'granted');
        } catch (error) {
            console.error(error);
            setPermission(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Text>Requesting permission ...</Text>;
    if (permission === false) return <Text>No access to camera</Text>;

    const handleBarcodeScanned = ({ type, data }: BarcodeScanningResult) => {
        try {
            console.log(type, data);
            let _data = JSON.parse(data);
            setScanData(_data);
        } catch (error) {
            console.error('Unable to parse QR code: ', error);
        }
        alert(`Scanned QR Code: ${data}`);
    };

    return (
        <View style={styles.container}>
            <CameraView
                onBarcodeScanned={scanData ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ["qr", "pdf417"] }}
                style={StyleSheet.absoluteFillObject}
            />
            {scanData && (
                <Button title="Scan Again" onPress={() => setScanData(undefined)} />
            )}
        </View>
    );
};

export default ScanScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
