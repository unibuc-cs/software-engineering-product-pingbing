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

export const getNote = async (id: string) => {
  try {
    // Retrieve the access token from secure storage
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

    // Send a GET request to the get_note endpoint
    const response = await api.get(`/api/notes/get_note`, {
      params: {
        noteId: id, // Pass noteId as a query parameter
      },
      headers: {
        Authorization: `Bearer ${accessToken}`, // Pass the token in the Authorization header
      },
    });

    return response.data; // Assuming the response contains the note details
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching the note', error.response?.data || error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};

export const getNotesByGroupId = async (groupId: string) => {
  try {
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

    const response = await api.get(`/api/notes/get_notes_from_group`, {
      params: {
        groupId,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching notes from group:', error.response?.data || error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};

export const addNote = async (title: string, content: string, groupId: string | null = null) => {
  try {
    // Retrieve the access token from secure storage
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

    // Send a POST request to the add_note endpoint
    const response = await api.post(
      '/api/notes/add_note',
      {
        title,   // Title of the note
        content, // Content of the note
        groupId, // Group ID to associate the note with
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Pass the token in the Authorization header
        },
      }
    );

    return response.data; // Assuming the response contains the created note details
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error adding a new note', error.response?.data || error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};

export const updateNote = async (id: string, title: string, content: string) => {
  try {
    // Retrieve the access token from secure storage
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

    // Send a PUT request to the update_note endpoint
    const response = await api.put(
      '/api/notes/update_note',
      {
        id,  // ID of the note to update
        title,       // Updated title
        content,     // Updated content
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Pass the token in the Authorization header
        },
      }
    );

    return response.data; // Assuming the response contains the updated note details
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error updating the note', error.response?.data || error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};

export const deleteNote = async (id: string) => {
  try {
    // Retrieve the access token from secure storage
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

    // Send a DELETE request to the delete_note endpoint
    const response = await api.delete('/api/notes/delete_note', {
      params: {
        noteId: id, // Pass noteId as a query parameter
      },
      headers: {
        Authorization: `Bearer ${accessToken}`, // Pass the token in the Authorization header
      },
    });

    return response.data; // Assuming the response confirms the deletion
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error deleting the note', error.response?.data || error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};
