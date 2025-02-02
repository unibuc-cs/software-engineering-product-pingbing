import axios from 'axios';
import api from './axiosInstance';
import * as SecureStore from 'expo-secure-store';

export const getOwnedNotes = async () => {
  try {
   
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

    
    const response = await api.get('/api/notes/owned_notes', {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
    });

    return response.data; 
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
  
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

   
    const response = await api.get(`/api/notes/get_note`, {
      params: {
        noteId: id, 
      },
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
    });

    return response.data; 
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
   
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

   
    const response = await api.post(
      '/api/notes/add_note',
      {
        title,  
        content, 
        groupId, 
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      }
    );

    return response.data; 
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
  
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

   
    const response = await api.put(
      '/api/notes/update_note',
      {
        id, 
        title,       
        content,    
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      }
    );

    return response.data; 
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
   
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

   
    const response = await api.delete('/api/notes/delete_note', {
      params: {
        noteId: id, 
      },
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
    });

    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error deleting the note', error.response?.data || error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};
