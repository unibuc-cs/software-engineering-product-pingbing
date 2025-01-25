import React, { useEffect, useState } from 'react';
import { Layout, Text, List, ListItem, Button, ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet, ListRenderItem, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as eva from '@eva-design/eva';
import { getOwnedNotes, addNote, deleteNote } from '../../services/noteService';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface Note {
  id: string;
  title: string;
}

export default function NotesScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]); // State for notes
  const [loading, setLoading] = useState(true); // State for loading

  // Fetch notes when the component mounts
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getOwnedNotes();
        setNotes(fetchedNotes.map((note: { id: string; title: string }) => ({ id: note.id, title: note.title })));
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Render note items
  const renderNote: ListRenderItem<Note> = ({ item }) => (
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
          params: { item: item.id }, // Pass the dynamic item as params
        })
      }
      style={styles.listItem}
    />
  );

  if (loading) {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={styles.loadingContainer}>
          <Text>Loading Notes...</Text>
        </Layout>
      </ApplicationProvider>
    );
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layout style={styles.container}>
        <List data={notes} renderItem={renderNote} style={styles.list} />
        <Button
          status="warning"
          onPress={() => {
            addNote('New Note', '', null);
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
  newNoteButton: {
    width: '90%',
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10
  },
});