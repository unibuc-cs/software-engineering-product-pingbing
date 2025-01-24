import React, { useState, useEffect } from 'react';
import { Input, Button, Layout, Text, ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet, Image, View, ActivityIndicator, ToastAndroid } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { editProfile, getProfile} from '../services/authService'; 
import * as eva from '@eva-design/eva';
import { useRouter } from 'expo-router';

const EditProfilePage: React.FC = () => {
  const [nickname, setNickname] = useState<string>('');
  const [avatarUri, setAvatarUri] = useState<string| null>(null); 
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    const fetchProfileInfo = async () => {
      const storedNickname = await SecureStore.getItemAsync('nickname');
      setNickname(storedNickname || '');

      const storedAvatarUri = await SecureStore.getItemAsync('avatarUri');
      setAvatarUri(storedAvatarUri);
    };

    fetchProfileInfo();
  }, []);

  const requestImagePermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access the media library is required!');
    }
  };

  const selectImage = async () => {
    try {
      await requestImagePermission();

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      alert('Failed to pick an image.');
      console.error(error);
    }
  };

  const handleSaveChanges = async () => {
    if (!nickname.trim()) {
      alert('Nickname is required!');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nickname', nickname.trim());

      if (avatarUri) {
        const filename = avatarUri.split('/').pop() || 'avatar.jpg';
        const fileType = avatarUri.match(/\.(\w+)$/)?.[1] || 'jpeg';

        formData.append('avatar', {
          uri: avatarUri,
          name: filename,
          type: `image/${fileType}`,
        } as any);
      }

      await editProfile(formData);

      await SecureStore.setItemAsync('nickname', nickname.trim());
      if (avatarUri) {
        const profileInfo = await getProfile();
        await SecureStore.setItemAsync('avatarPath', profileInfo.avatarPath)
        await SecureStore.setItemAsync('avatarUri', avatarUri);
      }

      ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
      router.push('/profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('An error occurred while updating your profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layout style={styles.container}>
      {avatarUri ? (
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          </View>
        ) : (
            <Image source={require('../assets/images/default_avatar.jpg') } style={styles.defaultImage} />
        )}
        <Button
          onPress={selectImage}
          disabled={loading}
          status="warning"
          appearance="ghost"
        >
          {avatarUri ? 'Change Avatar' : 'Select Avatar'}
        </Button>
        <Input
          label="Nickname"
          value={nickname}
          onChangeText={setNickname}
          style={styles.input}
          disabled={loading}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#FFB85F" />
        ) : (
          <Button
            onPress={handleSaveChanges}
            status="warning"
            style={styles.buttonSave}
            disabled={loading}
          >
            Save Changes
          </Button>
        )}
      </Layout>
    </ApplicationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    marginVertical: 10,
  },
  buttonSave: {
    marginTop: 20,
  },
  avatarContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  defaultImage: {
    width: 100,  
    height: 100, 
    borderRadius: 50, 
    borderWidth: 2, 
    borderColor: '#FFB85F', 
  },
});

export default EditProfilePage;


