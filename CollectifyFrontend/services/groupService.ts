import axios from 'axios';
import api from './axiosInstance';
import * as SecureStore from 'expo-secure-store';

export const GetGroupsByMemberId = async () => {
    try {
      
      const accessToken = await SecureStore.getItemAsync('accessToken');
  
      if (!accessToken) {
        throw new Error('Access token is missing. Please log in.');
      }
  
     
      const response = await api.get('/api/groups/get_member_groups', {
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      });
  
      return response.data; 
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
  
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

   
    const response = await api.get(`/api/groups/get_group`, {
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
      console.error('Error fetching the group', error.response?.data || error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};  

export const addGroup = async (name: string) => {
  try {
    
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

    
    const response = await api.post(
      '/api/groups/create_group',
      {
        name, 
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
      console.error('Error creating a group', error.response?.data || error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};

export const updateGroup = async (id: string, name: string) => {
  try {
   
    const accessToken = await SecureStore.getItemAsync('accessToken');
    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

    
    const response = await api.put(
      '/api/groups/update_group',
      {
        id,   
        name, 
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
      console.error('Error updating the group:', error.response?.data || error.message);
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

export const getGroupMembers = async (groupId: string) => {
  try {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }
    
    

    const response = await api.get('/api/groups/get_group_members', {
      params: { groupId },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Response data:", response.data);  
    return response.data;
  } catch (error) {
    console.error('Error fetching the group members:', error);
    throw error;
  }
};

export const deleteMemberFromGroup = async (groupId: string, memberId: string) => {
  try {
    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (!accessToken) {
      throw new Error('Access token is missing. Please log in.');
    }

    const response = await api.delete('/api/groups/remove_member', {
      data: {
        groupId: groupId,
        memberId: memberId,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error deleting the member', error.response?.data || error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    throw error;
  }
};