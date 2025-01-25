import React, { useEffect, useState } from 'react';
import { Layout, Text, List, ListItem, Button, ApplicationProvider } from '@ui-kitten/components';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import * as eva from '@eva-design/eva';
import { getNotesByGroupId, addNote, deleteNote } from '../../services/noteService';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

type Note = {
  id: string;
  title: string;
  content: string;
};

export default function FolderScreen() {
  const router = useRouter();
  const { item: groupId, groupName } = useLocalSearchParams<{ item: string; groupName: string }>();
  const [notes, setNotes] = useState<Note[]>([]); // State for notes
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for errors

  // Fetch notes when the component mounts
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null);
    
        if (groupId) {
          const fetchedData = await getNotesByGroupId(groupId as string);          
          const fetchedNotes = fetchedData.$values ? fetchedData.$values : []; 
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
      title={() => (
        <View style={styles.noteContainer}>
          <Text style={styles.title}>📝 { item.title }</Text>
          <TouchableOpacity onPress={() => deleteNote(item.id)}>
            <FontAwesome5 name="trash-alt" size={18} color="red" />
          </TouchableOpacity>
        </View>
    )}
    onPress={() =>
      router.push({
        pathname: '../notes/[item]',
        params: { item: item.id },
      })
    }
    style={styles.listItem}
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
          📁 {Array.isArray(groupName) ? groupName.join(', ') : groupName}
        </Text>
        <List
          data={notes}
          renderItem={renderNote}
          keyExtractor={(note) => note.id.toString()} // Ensure note.id is a string
          style={styles.list}
        />
        <Button
          status="warning"
          onPress={() => {
            addNote('New Note', '', groupId as string);
          }}
          style={styles.newNoteButton}
        >
          New Note
        </Button>
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
    marginHorizontal: 10,
  },
  listItem: {
    marginVertical: 4,
    height: 70,
    justifyContent: 'center',
  },
  newNoteButton: {
    width: '90%',
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10,
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10
  },
});
