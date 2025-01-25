import React, { useEffect, useState } from 'react';
import { Layout, Text, List, ListItem, Button, ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet, ListRenderItem, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as eva from '@eva-design/eva';
import { GetGroupsByMemberId, addGroup } from '../../services/groupService';

interface Group {
  id: string;
  name: string;
  creatorId: string;
}

export default function GroupsScreen() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch groups when the component mounts
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const fetchedGroups = await GetGroupsByMemberId();
        
        // Check if fetchedGroups.$values exists and is an array
        if (!fetchedGroups || !Array.isArray(fetchedGroups.$values)) {
          console.error('Fetched groups is not an array:', fetchedGroups);
          return;
        }
  
        // Map the $values array to extract group details
        setGroups(
          fetchedGroups.$values.map((group: { id: string; name: string; creatorId: string }) => ({
            id: group.id,
            name: group.name,
            creatorId: group.creatorId,
          }))
        );
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchGroups();
  }, []);
  

  // Render group items
  const renderGroup: ListRenderItem<Group> = ({ item }) => (
    <ListItem
      title={() => (
        <View style={styles.groupContainer}>
          <Text style={styles.name}>📁 {item.name}</Text>
        </View>
      )}
      onPress={() =>
        router.push({
          pathname: '../groups/[item]',
          params: {
            item: item.id,
            groupName: item.name,
          },
        })
      }
      style={styles.listItem}
    />
  );

  if (loading) {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={styles.loadingContainer}>
          <Text>Loading Groups...</Text>
        </Layout>
      </ApplicationProvider>
    );
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layout style={styles.container}>
        <List data={groups} renderItem={renderGroup} style={styles.list} />
        <Button
          status="warning"
          onPress={() => {
            addGroup('New Space');
          }}
          style={styles.newGroupButton}
        >
          New space
        </Button>
      </Layout>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#F7F9FC',
  },
  list: {
    marginHorizontal: 10,
  },
  listItem: {
    marginVertical: 4,
    height: 70,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  name: {
    fontSize: 18,
  },
  newGroupButton: {
    width: '90%',
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10
  },
  groupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10,
  },
});
