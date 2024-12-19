import React from 'react';
import { Layout, Text, Button, ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import * as eva from '@eva-design/eva';

export default function ProfileScreen() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={styles.container}>
        <Text category="h4" style={styles.title}>User Profile</Text>
        <Text category="s1" style={styles.subtitle}>Welcome, User!</Text>

        <Button
            style={styles.button}
            onPress={() => alert('Edit Profile')}
        >
            Edit Profile
        </Button>
        </Layout>
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
  title: {
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});
