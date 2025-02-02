import React, { useEffect, useState } from 'react';
import {
  Layout,
  Text,
  List,
  ListItem,
  ApplicationProvider,
  Avatar,
  Spinner,
  Button,
} from '@ui-kitten/components';
import { StyleSheet, ImageBackground } from 'react-native';
import * as eva from '@eva-design/eva';
import { getGroupMembers } from '../../services/groupService';
import { getProfile } from '../../services/authService';
import { useLocalSearchParams } from 'expo-router';
import { deleteMemberFromGroup } from '../../services/groupService'; 


type UserProfile = {
  id: string;
  nickname: string | null;
  avatarPath: string | null;
};

export default function GroupMembersScreen() {
  const { item: groupId } = useLocalSearchParams<{ item: string }>();

  const [groupMembers, setGroupMembers] = useState<UserProfile[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile();
        setCurrentUserId(profile.id); 
      } catch {
        setError('Failed to fetch user profile.');
      }
    };
    fetchUserProfile();
  }, []);

  
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        if (!groupId) return;
        const response = await getGroupMembers(groupId as string);
        
        const members: UserProfile[] = response?.$values ?? [];
        
        const filteredMembers = members;
        setGroupMembers(filteredMembers);
      } catch {
        setError('Failed to load group members. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [groupId, currentUserId]);

  
  const handleDeleteMember = async (memberId: string) => {
    try {
      await deleteMemberFromGroup(groupId as string, memberId);
      
      setGroupMembers((prevMembers) => prevMembers.filter((member) => member.id !== memberId));
      alert('Member removed successfully.');
    } catch (error) {
      alert('Failed to remove member.');
    }
  };

  if (error) {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={styles.container}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </Layout>
      </ApplicationProvider>
    );
  }

  if (loading) {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={styles.loadingContainer}>
          <Spinner size="giant" />
          <Text style={styles.loadingText}>Loading the members...</Text>
        </Layout>
      </ApplicationProvider>
    );
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <ImageBackground
          source={require('../../assets/images/background.jpeg')}
          style={styles.backgroundImage}
      >
      <Layout style={styles.container}>
        {groupMembers.length > 0 ? (
          <List
            data={groupMembers}
            style={styles.list}
            renderItem={({ item }) => (
              <ListItem
                title={() => (
                  <Text style={styles.memberText}>
                    {item.nickname ? item.nickname : 'Anonymous'} 
                  </Text>
                )}
                accessoryLeft={() => (
                  <Avatar source={{ uri: item.avatarPath ?? '' }} size="medium" />
                )}
                accessoryRight={() => (
                  <Button
                    status="danger"
                    size="small"
                    onPress={() => handleDeleteMember(item.id)} 
                  >
                    Delete
                  </Button>
                )}
                style={styles.listItem}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Text style={styles.noGroupsText}>No members. Add someone!</Text>
        )}
      </Layout>
      </ImageBackground>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  noGroupsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginVertical: 20,
  },
  list: {
    marginHorizontal: 10,
    backgroundColor: 'transparent',
  },
  listItem: {
    marginVertical: 4,
    height: 70,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  memberText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});
