import React, { useEffect, useState } from 'react';
import { Layout, Text, List, ListItem, Button, ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet, ListRenderItem, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import * as eva from '@eva-design/eva';
import { getOwnedNotes, addNote, deleteNote } from '../../services/noteService';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as SecureStore from 'expo-secure-store';

interface Note {
  id: string;
  title: string;
}

export default function NotesScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]); // State for notes
  const [loading, setLoading] = useState(true); // State for loading
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Fetch notes when the component mounts
  useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (accessToken) {
        setIsLoggedIn(true);  // User is logged in
        fetchNotes();  // Fetch notes if logged in
      } else {
        setIsLoggedIn(false); // User is not logged in
        setLoading(false);  // No need to fetch notes if not logged in
      }
    };

    checkLoginStatus();
  }, []);

  // Fetch notes
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

  const handleAddNote = async () => {
    await addNote('New Note', '', null);  // Create a new note
    fetchNotes(); // Fetch the updated notes
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);  // Delete a note
    fetchNotes(); // Fetch the updated notes
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
      style={styles.listItem}
      activeOpacity={0.7}
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

  if (!isLoggedIn) {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <ImageBackground
          source={require('../../assets/images/background.jpeg')}
          style={styles.backgroundImage}
        >
          <Layout style={styles.centeredContainer}>
            <Text category="h1">Welcome to Collectify!</Text>
            <Text category="h6">You need to log in to see your notes.</Text>
          </Layout>
        </ImageBackground>
      </ApplicationProvider>
    );
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <ImageBackground
        source={require('../../assets/images/background.jpeg')}
        style={styles.backgroundImage}
      >
        <Layout style={styles.container}>
          <List data={notes} renderItem={renderNote} style={styles.list} />
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
    backgroundColor: '#F7F9FC'
  },
  title: {
    fontSize: 18
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover'
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
});
