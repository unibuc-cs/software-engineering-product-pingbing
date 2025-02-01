import React, { useEffect, useState } from 'react';
import {
  Layout,
  Text,
  List,
  ListItem,
  ApplicationProvider,
  Avatar,
  Spinner,
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import * as eva from '@eva-design/eva';
import { getGroupMembers } from '../../services/groupService';
import { getProfile } from '../../services/authService';
import { useLocalSearchParams } from 'expo-router';

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

  // Fetch the current user's profile once when the component mounts.
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getProfile();
        setCurrentUserId(profile.id); // Assuming the profile includes "id"
      } catch {
        setError('Failed to fetch user profile.');
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch group members whenever groupId or currentUserId changes.
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        if (!groupId) return;
        const response = await getGroupMembers(groupId as string);
        // The backend wraps the members inside $values.
        const members: UserProfile[] = response?.$values ?? [];
        // Exclude the current user from the group members.
        const filteredMembers = currentUserId
          ? members.filter((member: UserProfile) => member.id !== currentUserId)
          : members;
        setGroupMembers(filteredMembers);
      } catch {
        setError('Failed to load group members. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [groupId, currentUserId]);

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
      <Layout style={styles.container}>
        {groupMembers.length > 0 ? (
          <List
            data={groupMembers}
            renderItem={({ item }) => (
              <ListItem
                title={() => (
                  <Text style={styles.memberText}>
                    {item.nickname ? item.nickname : 'Anonymous'} {/* Fallback to "Anonymous" if no nickname */}
                  </Text>
                )}
                accessoryLeft={() => (
                  <Avatar source={{ uri: item.avatarPath ?? '' }} size="medium" />
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
});
