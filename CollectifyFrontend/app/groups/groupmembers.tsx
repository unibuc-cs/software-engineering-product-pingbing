import React, { useEffect, useState } from 'react';
import { Layout, Text, List, ListItem, ApplicationProvider, Avatar } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import * as eva from '@eva-design/eva';
import { getGroupMembers } from '../../services/groupService';
import { getProfile } from '../../services/authService'; // Import getProfile
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

type UserProfile = {
  id: string;
  nickname: string;
  avatarPath: string | null;
};

export default function GroupMembersScreen() {
  const { item: groupId } = useLocalSearchParams<{ item: string }>();

  const [groupMembers, setGroupMembers] = useState<UserProfile[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetchGroupMembers = async () => {
    try {
      if (!groupId) return;
  
      const response = await getGroupMembers(groupId as string);
      const members: UserProfile[] = response?.$values ?? []; // Ensure members is typed correctly
  
      if (currentUserId) {
        // Exclude the current user from the members list
        const filteredMembers = members.filter((member: UserProfile) => member.id !== currentUserId);
        setGroupMembers(filteredMembers);
        console.log(groupMembers)
      } else {
        setGroupMembers(members);
      }
    } catch {
      setError('Failed to load group members. Please try again.');
    }
  };
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile();
        setCurrentUserId(profile.id); // Assuming the profile response includes "id"
      } catch {
        setError('Failed to fetch user profile.');
      }
    };

    fetchUserProfile();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchGroupMembers();
    }, [groupId, currentUserId]) // Depend on currentUserId to ensure filtering
  );

  if (error) {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={styles.container}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </Layout>
      </ApplicationProvider>
    );
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layout style={styles.container}>
        {groupMembers.length > 0 ? (
          <List
            data={groupMembers}
            renderItem={({ item }) => (
              <ListItem
                title={item.nickname}
                description={item.avatarPath ? 'Has an avatar' : 'No avatar'}
                accessoryLeft={() => (
                  <Avatar source={{ uri: item.avatarPath ?? '' }} size="small" />
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
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  noGroupsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginVertical: 20,
  },
  listItem: {
    marginVertical: 4,
    height: 50,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
});
