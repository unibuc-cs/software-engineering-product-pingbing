import React, { useState } from 'react';
import { Layout, Text, List, ListItem, Button, ApplicationProvider } from '@ui-kitten/components';
import { StyleSheet, ListRenderItem, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import { getOwnedNotes, addNote, deleteNote } from '../../services/noteService';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { refreshAccessToken } from '../../services/authService';



interface Note {
  id: string;
  title: string;
}



export default function NotesScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]); // State for notes
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const fetchedNotes = await getOwnedNotes();
      setNotes(
        fetchedNotes.map((note: { id: string; title: string }) => ({
          id: note.id,
          title: note.title,
        }))
      );
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Check login status and fetch notes when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const checkLoginStatus = async () => {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        if (accessToken) {
          const isExpired = isTokenExpired(accessToken);
          if (isExpired) {
            try {
              await refreshAccessToken();
              setIsLoggedIn(true);
              fetchNotes(); // Fetch notes if logged in
            } catch (error) {
              setIsLoggedIn(false);
            }
          } else {
            setIsLoggedIn(true);
            fetchNotes(); // Fetch notes if logged in
          }
        } else {
          setIsLoggedIn(false); // User is not logged in
        }
      };

      checkLoginStatus();
    }, [])
  );

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  const handleAddNote = async () => {
    await addNote('New Note', '', null); // Create a new note
    fetchNotes(); // Fetch the updated notes
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId); // Delete a note
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
      onPress={() =>
        router.push({
          pathname: '../notes/[item]',
          params: { item: item.id },
        })
      }
      style={styles.listItem}
      activeOpacity={0.7}
    />
  );

  if (!isLoggedIn) {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <ImageBackground
          source={require('../../assets/images/background.jpeg')}
          style={styles.backgroundImage}
        >
          <Layout style={styles.centeredContainer}>
            <Text category="h1">Welcome to Collectify!</Text>
            <Text category="h6">We're glad to have you here 🥳</Text>
            <Button
              size="medium"
              appearance="filled"
              status="warning"
              onPress={() => router.push('../login')}
              style={{ width: "50%", margin: 15 }}
            >
              Log In
            </Button>
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
  title: {
    fontSize: 18,
  },
  newNoteButton: {
    width: '90%',
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
