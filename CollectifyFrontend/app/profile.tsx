import React from 'react';
import { Layout, Text, Button, ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { BlurView } from 'expo-blur';
import * as eva from '@eva-design/eva';

export default function ProfileScreen() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <ImageBackground
        source={require('../assets/images/background.jpeg')} // Replace with your local image path
        style={styles.container}
      >
        <BlurView
          intensity={70} // Adjust the intensity of the blur
          style={styles.blurContainer} // Apply style to BlurView container
        >
          <Text category="h4" style={styles.title}>User Profile</Text>
          <Text category="s1" style={styles.subtitle}>Welcome, User!</Text>

          <Button
            style={styles.button}
            status="warning"
            onPress={() => alert('Edit Profile')}
          >
            Edit Profile
          </Button>
        </BlurView>
      </ImageBackground>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  blurContainer: {
    width: '80%',
    height: '50%', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 10,
    color: '#fff',
  },
  subtitle: {
    marginBottom: 20,
    color: '#fff',
  },
  button: {
    marginTop: 10,
  },
});
