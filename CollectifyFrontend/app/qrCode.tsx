import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@ui-kitten/components'; // UI Kitten Text component

import { useRouter, useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';

const QRCodeScreen = () => {
  const router = useRouter();
  const { item: groupId } = useLocalSearchParams<{ item: string }>(); 
  console.log("From qrcode the groupid: ", groupId)

  if (!groupId) {
    return (
      <View style={styles.container}>
        <Text category='h3'>No group ID provided</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Add text above the QR Code */}
      {/* <Text category='h5' style={styles.qrText}>Screenshot and send this QR code to your friend!</Text> */}
      <QRCode value={groupId} />
    </View>
  );
};

export default QRCodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrText: {
    marginBottom: 20, // Add space between the text and the QR code
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
  },
});
