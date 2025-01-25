import axios from 'axios';
import api from './axiosInstance';
import * as SecureStore from 'expo-secure-store';

export const GetGroupsByMemberId = async () => {
    try {
      // Retrieve the access token from secure storage
      const accessToken = await SecureStore.getItemAsync('accessToken');
  
      if (!accessToken) {
        throw new Error('Access token is missing. Please log in.');
      }
  
      // Add the Authorization header
      const response = await api.get('/api/groups/get_member_groups', {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Pass the token here
        },
      });
  
      return response.data; // Assuming the response contains the notes
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching the groups that the member is part of', error.response?.data || error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
      throw error;
    }
  };
  
export const getGroup = async (id: string) => {
  try {
    // Retrieve the access token from secure storage
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

    // Send a GET request to the get_group endpoint
    const response = await api.get(`/api/groups/get_group`, {
      params: {
        groupId: id, // Pass groupId as a query parameter
      },
      headers: {
        Authorization: `Bearer ${accessToken}`, // Pass the token in the Authorization header
      },
    });

    return response.data; // Assuming the response contains the group details
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching the group', error.response?.data || error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};  

export const addGroup = async (name: string) => {
  try {
    // Retrieve the access token from secure storage
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

    // Send a POST request to the add_group endpoint
    const response = await api.post(
      '/api/groups/create_group',
      {
        name, // Name of the group
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Pass the token in the Authorization header
        },
      }
    );

    return response.data; // Assuming the response contains the created group details
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error creating a group', error.response?.data || error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};

export const deleteGroup = async (id: string) => {
  try {
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

    const response = await api.delete('/api/groups/delete_group', {
      params: {
        groupId: id,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error deleting the group', error.response?.data || error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};