import React from 'react';
import { Layout, Text, Button, List, ListItem, Icon, ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet, ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import * as eva from '@eva-design/eva';

// Dummy data for folders and notes
const folders: string[] = ['Work', 'Personal', 'Ideas'];
const notes: string[] = ['MeetingNotes', 'ShoppingList', 'ProjectPlan'];

export default function HomeScreen() {
  const router = useRouter();

  // Render folder items
  const renderFolder: ListRenderItem<string> = ({ item }) => (
    <ListItem
      title={`📁 ${item}`}
      onPress={() =>
        router.push({
          pathname: './folders/[item]',
          params: { item }, // Pass the dynamic item as params
        })
      }
      style={styles.listItem}
    />
  );

  // Render note items
  const renderNote: ListRenderItem<string> = ({ item }) => (
    <ListItem
      title={`📝 ${item}`}
      onPress={() =>
        router.push({
          pathname: './notes/[item]',
          params: { item }, // Pass the dynamic item as params
        })
      }
      style={styles.listItem}
    />
  );

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layout style={styles.container}>
        {/* Top Banner */}
        <Layout style={styles.topBanner} level="2">
          <Text category="h5">My Notes</Text>
          <Button
            size="small"
            //accessoryLeft={(props) => <Icon {...props} name="person-outline" />}
            onPress={() => router.push('./profile')}
          >
            Profile
          </Button>
        </Layout>

        {/* Notes Section */}
        <Text category="h6" style={styles.sectionTitle}>Notes</Text>
        <List
          data={notes}
          renderItem={renderNote}
          style={styles.list}
        />

        {/* Folders Section */}
        <Text category="h6" style={styles.sectionTitle}>Folders</Text>
        <List
          data={folders}
          renderItem={renderFolder}
          style={styles.list}
        />

        {/* Bottom Footer */}
        <Layout style={styles.footer} level="2">
          <Button
            status="primary"
            size="giant"
            //accessoryLeft={(props) => <Icon {...props} name="plus-outline" />}
            onPress={() => alert('Add Note or Folder')}
            style={styles.addButton}
          />
        </Layout>
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
  topBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    marginLeft: 10,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  list: {
    marginHorizontal: 10,
  },
  listItem: {
    marginVertical: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
