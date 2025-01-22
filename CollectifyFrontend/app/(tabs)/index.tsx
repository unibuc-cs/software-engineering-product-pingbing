import React, { useEffect, useState } from 'react';
import { Layout, Text, List, ListItem, ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet, ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import * as eva from '@eva-design/eva';
import { getOwnedNotes } from '../../services/noteService';

export default function NotesScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<string[]>([]); // State for notes
  const [loading, setLoading] = useState(true); // State for loading

  // Fetch notes when the component mounts
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getOwnedNotes();
        setNotes(fetchedNotes.map((note: { title: string }) => note.title)); // Adjust the mapping based on your API response
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Render note items
  const renderNote: ListRenderItem<string> = ({ item }) => (
    <ListItem
      title={() => (
        <Text style={styles.title}>📝 {item}</Text> // Custom Text component with style
      )}
      onPress={() =>
        router.push({
          pathname: '../notes/[item]',
          params: { item }, // Pass the dynamic item as params
        })
      }
      style={styles.listItem}
    />
  );

  if (loading) {
    return (
      <Layout style={styles.loadingContainer}>
        <Text>Loading Notes...</Text>
      </Layout>
    );
  }

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
  title: {
    fontSize: 18,
  },
});
