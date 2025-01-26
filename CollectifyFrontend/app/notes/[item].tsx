import React, { useEffect, useState } from 'react';
import { Layout, Text, Input, ApplicationProvider } from '@ui-kitten/components';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, ImageBackground } from 'react-native';
import * as eva from '@eva-design/eva';
import { getNote, updateNote } from '../../services/noteService';

export default function NoteScreen() {
  const { item } = useLocalSearchParams(); // Get note id from params
  const [noteTitle, setNoteTitle] = useState(''); // State for the note title
  const [noteContent, setNoteContent] = useState(''); // State for the note content
  const [loading, setLoading] = useState(true); // State for loading

  // A timeout ID to manage debounce
  let debounceTimeout: NodeJS.Timeout;

  useEffect(() => {
    const fetchNote = async () => {
      try {
        if (item) {
          const note = await getNote(item as string); // Fetch the note using the ID
          setNoteTitle(note.title); // Set the title
          setNoteContent(note.content); // Set the content
        }
      } catch (error) {
        console.error('Error fetching the note:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [item]);

  // Debounced updateNote function
  const debouncedSaveNote = (content: string, title: string) => {
    clearTimeout(debounceTimeout); // Clear previous timeout
    debounceTimeout = setTimeout(async () => {
      try {
        if (item) {
          await updateNote(item as string, title, content); // Save the updated note content
          console.log('Note updated successfully!');
        }
      } catch (error) {
        console.error('Error saving the note:', error);
      }
    }, 1000); // Adjust debounce delay as needed (e.g., 1000ms = 1 second)
  };

  if (loading) {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={styles.container}>
          <Text>Loading Note...</Text>
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
          {/* Title section */}
          <Input
            style={styles.titleInput}
            textStyle={{ fontSize: 24, fontWeight: 'bold' }}
            value={noteTitle}
            onChangeText={(text) => {
              setNoteTitle(text); // Update local state
              debouncedSaveNote(noteContent, text); // Call debounced save
            }}
          />
  
          {/* Note content */}
          <Input
            style={styles.contentInput}
            multiline={true}
            textStyle={{ minHeight: '100%', textAlignVertical: 'top' }}
            value={noteContent}
            onChangeText={(text) => {
              setNoteContent(text); // Update local state
              debouncedSaveNote(text, noteTitle); // Call debounced save
            }}
            autoFocus
          />
        </Layout>
      </ImageBackground>
    </ApplicationProvider>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make container fill the screen
    padding: 20,
    backgroundColor: 'transparent', // Make sure the container is transparent so the background image shows through
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: 'white', // Input background color
    opacity: 0.9,
    borderWidth: 0, // Remove input borders
    borderRadius: 15,
  },
  contentInput: {
    flex: 1, // Make input box take remaining screen space
    backgroundColor: 'white', // Input background color
    opacity: 0.9,
    borderWidth: 0, // Remove input borders
    borderRadius: 15,
  },
  backgroundImage: {
    flex: 1, // Ensures the image fills the screen
    resizeMode: 'cover', // Ensures the image is properly scaled
  },
});
