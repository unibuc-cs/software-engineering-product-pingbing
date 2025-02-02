import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ApplicationProvider, Layout, Text, Input, Button } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import * as eva from '@eva-design/eva';
import { loginUser } from '../services/authService'; 
import * as SecureStore from 'expo-secure-store';
import { FontAwesome } from '@expo/vector-icons'; 

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
  
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const tokens = await loginUser(email, password); 
      
      await SecureStore.setItemAsync('accessToken', tokens.accessToken);
      await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
      await SecureStore.setItemAsync('userEmail', email);
      alert('Log-In successful!');
      router.replace('/');
    } catch (error) {
      console.error('Log-In error:', error);
      alert('Log-In failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible); 
  };

  const renderPasswordIcon = () => (
    <FontAwesome
      name={isPasswordVisible ? 'eye' : 'eye-slash'} 
      color="#8F9BB3"
      size={24}
      onPress={togglePasswordVisibility} 
    />
  );

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layout style={styles.container}>
        <Text category="h4" style={styles.title}>
          Log In
        </Text>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible} 
          style={styles.input}
          accessoryRight={renderPasswordIcon} 
        />
        <Button onPress={handleLogin} status = "warning" disabled={loading} style={styles.button}>
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
        <Button
          appearance="ghost"
          status="warning"
          onPress={() => router.push('/signup')}
          style={styles.signupButton}
        >
          Don’t have an account? Sign Up
        </Button>
      </Layout>
    </ApplicationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 10,
  },
  signupButton: {
    marginTop: 10,
    textAlign: 'center',
  },
});

export default LoginPage;




