import React, { useState } from 'react';
import { Layout, Text, List, ListItem, Button, ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet, ListRenderItem, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import * as eva from '@eva-design/eva';
import { GetGroupsByMemberId, addGroup, deleteGroup } from '../../services/groupService';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface Group {
  id: string;
  name: string;
  creatorId: string;
}

export default function GroupsScreen() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);

  // Fetch groups
  const fetchGroups = async () => {
    try {
      const fetchedGroups = await GetGroupsByMemberId();

      if (!fetchedGroups || !Array.isArray(fetchedGroups.$values)) {
        console.error('Fetched groups is not an array:', fetchedGroups);
        return;
      }

      setGroups(
        fetchedGroups.$values.map((group: { id: string; name: string; creatorId: string }) => ({
          id: group.id,
          name: group.name,
          creatorId: group.creatorId,
        }))
      );
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  // Call fetchGroups whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchGroups();
    }, [])
  );

  // Handle adding a new group
  const handleAddGroup = async () => {
    try {
      await addGroup('New Space');
      fetchGroups(); // Refresh groups list
    } catch (error) {
      console.error('Error adding a group:', error);
    }
  };

  // Handle deleting a group
  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deleteGroup(groupId);
      fetchGroups(); // Refresh groups list
    } catch (error) {
      console.error('Error deleting a group:', error);
    }
  };

  const renderGroup: ListRenderItem<Group> = ({ item }) => (
    <ListItem
      title={() => (
        <View style={styles.groupContainer}>
          <Text style={styles.name}>📁 {item.name}</Text>
          <TouchableOpacity onPress={() => handleDeleteGroup(item.id)}>
            <FontAwesome5 name="trash-alt" size={18} color="red" />
          </TouchableOpacity>
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

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <ImageBackground
        source={require('../../assets/images/loading_background.jpeg')}
        style={styles.backgroundImage}
      >
        <Layout style={styles.container}>
          {groups.length > 0 ? (
            <List data={groups} renderItem={renderGroup} style={styles.list} />
          ) : (
            <Text style={styles.noGroupsText}>No groups available. Add a new group!</Text>
          )}
          <Button
            status="warning"
            onPress={handleAddGroup}
            style={styles.newGroupButton}
          >
            New Space
          </Button>
        </Layout>
      </ImageBackground>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: 'transparent',
  },
  list: {
    marginHorizontal: 10,
    backgroundColor: 'transparent',
  },
  listItem: {
    marginVertical: 4,
    height: 70,
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'white',
  },
  name: {
    fontSize: 18,
  },
  newGroupButton: {
    width: '90%',
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop:10,
  },
  groupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  noGroupsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginVertical: 20,
  },
});
