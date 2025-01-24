import React, { useState } from 'react';
import { Layout, Input, Button, Text, Spinner, ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as eva from '@eva-design/eva';
import { registerUser } from '../services/authService';
import { FontAwesome } from '@expo/vector-icons'; 
import { AxiosError } from 'axios'; 

const SignupPage: React.FC = () => {
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); 
  const [passwordError, setPasswordError] = useState(''); 

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await registerUser(email, password);
      alert('Registration successful! Please log in.');
      router.push('/login'); 
    } catch (error: unknown) {
      console.error('Sign Up error:', error);
      if (error instanceof AxiosError && error.response && error.response.data) {
        if (error.response.data.includes('Passwords must be at least 6 characters') || 
            error.response.data.includes('Passwords must have at least one non alphanumeric character') || 
            error.response.data.includes('Passwords must have at least one digit') || 
            error.response.data.includes('Passwords must have at least one uppercase')) {
              const errorMessage = error.response.data;
              const passwordValidationErrors = errorMessage.replace('Failed to create user: ', '');
              setPasswordError(passwordValidationErrors);
        } else {
          alert('Sign-Up failed. Try again.');
        }
      } else {
        alert('Sign-Up failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible); 
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible); 
  };

  const renderPasswordIcon = () => (
    <FontAwesome
      name={isPasswordVisible ? 'eye' : 'eye-slash'} 
      color="#8F9BB3"
      size={24}
      onPress={togglePasswordVisibility} 
    />
  );

  const renderConfirmPasswordIcon = () => (
    <FontAwesome
      name={isConfirmPasswordVisible ? 'eye' : 'eye-slash'} 
      color="#8F9BB3"
      size={24}
      onPress={toggleConfirmPasswordVisibility} 
    />
  );

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layout style={styles.container}>
        <Text category="h4" style={styles.title}>
          Sign Up
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
          secureTextEntry={!isPasswordVisible} 
          onChangeText={setPassword}
          style={styles.input}
          accessoryRight={renderPasswordIcon} 
        />
        
        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          secureTextEntry={!isConfirmPasswordVisible} 
          onChangeText={setConfirmPassword}
          style={styles.input}
          accessoryRight={renderConfirmPasswordIcon} 
        />
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>} 
        <Button onPress={handleSignup} status = "warning" disabled={loading} style={styles.button}>
                  {loading ? 'Signing up...' : 'Sign up'}
                </Button>
        <Button
          appearance="ghost"
          status="warning"
          onPress={() => router.push('/login')} 
          style={styles.linkButton}
        >
          Already have an account? Log In
        </Button>
      </Layout>
    </ApplicationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F7F9FC',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginVertical: 10,
  },
  button: {
    marginVertical: 20,
  },
  linkButton: {
    alignSelf: 'center',
  },
  errorText: {
    color: 'red', 
    fontSize: 14,
    marginTop: 5,  
  }
});

export default SignupPage;



