import React from 'react';
import { Layout, Text, List, ListItem, ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet, ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import * as eva from '@eva-design/eva';

// Dummy data for notes
const notes: string[] = ['MeetingNotes', 'ShoppingList', 'ProjectPlan', 'e', 't', 'y', 'i'];

export default function NotesScreen() {
  const router = useRouter();

  // Render note items
  const renderNote: ListRenderItem<string> = ({ item }) => (
    <ListItem
      title={`📝 ${item}`}
      onPress={() =>
        router.push({
          pathname: '../notes/[item]',
          params: { item }, // Pass the dynamic item as params
        })
      }
      style={styles.listItem}
    />
  );

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layout style={styles.container}>
        <List data={notes} renderItem={renderNote} style={styles.list} />
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
  }
});
