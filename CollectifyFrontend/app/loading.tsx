import React from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';
import { ApplicationProvider, Spinner } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';


export default function Index() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <ImageBackground
        source={require('../assets/images/loading_background.jpeg')} 
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Collectify</Text>
          <Spinner size="large" status="warning" />
        </View>
      </ImageBackground>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black', 
    marginBottom: 20, 
  },
});




