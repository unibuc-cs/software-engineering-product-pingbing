import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { Layout, Text, List, ListItem, ApplicationProvider } from '@ui-kitten/components';

import QRCode from 'react-native-qrcode-svg';
import { IStackScreenProps } from '../../src/library/IStackScreenProps';
import { IQRCodePayload } from '../../src/library/IQRCodePayload';

const QRCodeScreen: React.FunctionComponent<IStackScreenProps> = (props) => {
    const { navigation } = props;
    const payload: IQRCodePayload = { name: 'Cool Person', number: '1-234-567-8900' };

    return (
        <View style={styles.container}>
            <QRCode value={JSON.stringify(payload)} />
            <View style={styles.button}>
                <Button title="Go to Scanner" onPress={() => navigation.navigate('Scan')} />
            </View>
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