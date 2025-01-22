import axios from 'axios';
import api from './axiosInstance';
import * as SecureStore from 'expo-secure-store';

export const getOwnedNotes = async () => {
  try {
    // Retrieve the access token from secure storage
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

    // Add the Authorization header
    const response = await api.get('/api/notes/owned_notes', {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Pass the token here
      },
    });

    return response.data; // Assuming the response contains the notes
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching owned notes', error.response?.data || error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};
