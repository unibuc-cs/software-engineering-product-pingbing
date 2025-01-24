import React, { useEffect, useState } from 'react';
import { Layout, Text, List, ListItem, Button, ApplicationProvider } from '@ui-kitten/components';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import * as eva from '@eva-design/eva';
import { getNotesByGroupId, addNote } from '../../services/noteService'; // Import the API function

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function FolderScreen() {
  const { groupId, groupName } = useLocalSearchParams(); // Get both groupId and groupName from route params
  const [notes, setNotes] = useState<Note[]>([]); // State to store notes
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for errors

  // Fetch notes when the component mounts
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null);

        if (groupId) {
          const fetchedNotes = await getNotesByGroupId(groupId as string); // Fetch notes by group ID
          setNotes(fetchedNotes);
        }
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError('Failed to load notes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [groupId]);

  // Render note items
  const renderNote = ({ item }: { item: Note }) => (
    <ListItem
      title={`📝 ${item.title}`}
      description={item.content} // Optionally display content as description
      style={styles.listItem}
      onPress={() => alert(`Opening: ${item.title}`)} // Replace with navigation logic if needed
    />
  );

  if (loading) {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={styles.container}>
          <Text>Loading Notes...</Text>
        </Layout>
      </ApplicationProvider>
    );
  }

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
      <Text category="h4" style={styles.title}> 
        📁 {Array.isArray(groupName) ? groupName.join(', ') : groupName }
      </Text>        
      <List
          data={notes}
          renderItem={renderNote}
          keyExtractor={(note) => note.id}
          style={styles.list}
        />
      </Layout>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 10,
  },
  list: {
    marginTop: 10,
  },
  listItem: {
    marginVertical: 2,
  },
  newNoteButton: {
    width: '90%',
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10
  },
});
