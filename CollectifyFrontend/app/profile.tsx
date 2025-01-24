import React, { useEffect, useState } from 'react';
import { Layout, Text, Button, ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet, ImageBackground, View, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import * as eva from '@eva-design/eva';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const [nickname, setNickname] = useState<string | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);  

  const router = useRouter();

  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        const storedNickname = await SecureStore.getItemAsync('nickname');
        setNickname(storedNickname || 'user');
        const avatarPath = await SecureStore.getItemAsync('avatarPath');
        console.log("avatar path",avatarPath)
        if (avatarPath) {
          const avatarUrl = `http://10.0.2.2:5251${avatarPath}`; 
          setAvatarUri(avatarUrl);
          await SecureStore.setItemAsync('avatarUri', avatarUrl);
        } //else {
        //   setAvatarUri('http://10.0.2.2:5251/static/avatar/default_avatar.jpg');
        //   await SecureStore.setItemAsync('avatarUri', 'http://10.0.2.2:5251/static/avatar/default_avatar.jpg');
        // }
        console.log("avtar uri", avatarUri)
      } catch (error) {
        console.error('Error fetching profile info:', error);
        setNickname('user');
        setAvatarUri(null);  
      }
    };

    fetchProfileInfo();
  }, []);

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <ImageBackground
        source={require('../assets/images/background.jpeg')} 
        style={styles.container}
      >
        <BlurView
          intensity={70} 
          style={styles.blurContainer} 
        >
          <View style={styles.avatarContainer}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Image source={require('../assets/images/default_avatar.jpg') } style={styles.avatarImage} />
            )}
          </View>
          <Text category="h4" style={styles.title}>Your Profile</Text>
          <Text category="s1" style={styles.subtitle}>Welcome {nickname || 'user'}</Text>

          <Button
            style={styles.button}
            status="warning"
            onPress={() => router.push('../editProfile')}
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
  avatarContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,  
  },
  noAvatarText: {
    color: '#fff',
    fontSize: 16,
  },
});
