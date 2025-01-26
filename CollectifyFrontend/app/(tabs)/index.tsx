import React, { useEffect, useState } from 'react';
import { Layout, Text, List, ListItem, Button, ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet, ListRenderItem, View, TouchableOpacity, ImageBackground } from 'react-native';
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

  const handleAddNote = async () => {
    await addNote('New Note', '', null);  // Create a new note
    const fetchedNotes = await getOwnedNotes();     // Fetch the updated notes
    setNotes(fetchedNotes.map((note: { id: string; title: string }) => ({ id: note.id, title: note.title })));
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);  // Create a new note
    const fetchedNotes = await getOwnedNotes();     // Fetch the updated notes
    setNotes(fetchedNotes.map((note: { id: string; title: string }) => ({ id: note.id, title: note.title })));
  };

  // Render note items
  const renderNote: ListRenderItem<Note> = ({ item }) => (
    <ListItem
      title={() => (
        <View style={styles.noteContainer}>
          <Text style={styles.title}>📝 {item.title}</Text>
          <TouchableOpacity onPress={() => handleDeleteNote(item.id)}>
            <FontAwesome5 name="trash-alt" size={18} color="red" />
          </TouchableOpacity>
        </View>
      )}
      onPress={() => {
        router.push({
          pathname: '../notes/[item]',
          params: { item: item.id },
        });
      }}
      style={styles.listItem}  // default opacity
      activeOpacity={0.7}  // Set active opacity to 0.1 on press
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
      <ImageBackground
        source={require('../../assets/images/background.jpeg')} // Add your image path here
        style={styles.backgroundImage}
      >
        <Layout style={styles.container}>
          <List data={notes} renderItem={renderNote} style={styles.list}  />
          <Button
            status="warning"
            onPress={handleAddNote}
            style={styles.newNoteButton}
          >
            New Note
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
    backgroundColor: 'transparent'
  },
  list: {
    marginHorizontal: 10,
    backgroundColor: 'transparent'
  },
  listItem: {
    marginVertical: 4,
    height: 70,
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'white'
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
    marginBottom: 10,
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10,
  },
  backgroundImage: {
    flex: 1, // Ensures the image fills the screen
    resizeMode: 'cover', // Ensures the image is properly scaled
  },
});
