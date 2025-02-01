import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { IQRCodePayload } from '../src/library/IQRCodePayload';

const QRCodeScreen = () => {
    const router = useRouter();
    const payload: IQRCodePayload = { name: 'Cool Person', number: '1-234-567-8900' };

    return (
        <View style={styles.container}>
            <QRCode value={JSON.stringify(payload)} />
            {/* <View style={styles.button}>
                <Button title="Go to Scanner" onPress={() => router.push('/scan')} />
            </View> */}
        </View>
    );
};

export default QRCodeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        marginTop: 10
    }
}); 